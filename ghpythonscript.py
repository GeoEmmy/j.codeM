"""Grasshopper Python Script - Carbon coloring with PERCENT range (not percentile)
Inputs:
    text_data: list[str]
    geometry: Brep or Mesh or Extrusion (Item/List Access)
    carbon_values: list[float] (List Access)
    total_area: float (연면적 m²)
    enabled: bool
Outputs:
    a: Data POST response
    b: Geometry POST response
    c: Status message
"""

import Rhino.Geometry as rg
import System
import json

# ----------------- Range 설정 (퍼센트) -----------------
# 전체 (min..max) 범위에서 몇 %만 사용할지 결정
LOW_PCT  = 0.00   # 0% (0.05 = 하위 5% 잘라내기)
HIGH_PCT = 1.00   # 100% (0.95 = 상위 5% 잘라내기)

# ----------------- Utility -----------------
def post_json(url, payload):
    """POST JSON with WebClient (IronPython 호환)"""
    try:
        client = System.Net.WebClient()
        client.Headers[System.Net.HttpRequestHeader.ContentType] = "application/json"
        data = System.Text.Encoding.UTF8.GetBytes(json.dumps(payload))
        result = client.UploadData(url, "POST", data)
        text = System.Text.Encoding.UTF8.GetString(result)
        try:
            return json.loads(text)
        except:
            return text
    except Exception as e:
        return {"error": str(e)}

def parse_text(lines):
    """CSV-like text → list of dict (TEXT DATA 전송용)
    Format: element_type, name, material, carbon_emission, weight, volume, area, material_cost
    """
    items = []
    if not lines:
        return items
    if isinstance(lines, str):
        lines = lines.splitlines()
    for line in lines:
        parts = [p.strip() for p in line.split(",")]
        if len(parts) >= 8:  # 8개 필드: material_cost 포함
            try:
                carbon = float(parts[3])
                area = float(parts[6])
                material_cost = float(parts[7])
                items.append({
                    "element_type": parts[0],
                    "name": parts[1],
                    "material": parts[2],
                    "carbon_emission": carbon,
                    "weight": float(parts[4]),
                    "volume": float(parts[5]),
                    "area": area,
                    "material_cost": material_cost  # ⭐ 자재비
                })
            except Exception as e:
                print("Error parsing line: {} - {}".format(line, str(e)))
                pass
        elif len(parts) >= 7:  # 7개 필드: area 포함 (호환성)
            try:
                carbon = float(parts[3])
                area = float(parts[6])
                items.append({
                    "element_type": parts[0],
                    "name": parts[1],
                    "material": parts[2],
                    "carbon_emission": carbon,
                    "weight": float(parts[4]),
                    "volume": float(parts[5]),
                    "area": area,
                    "material_cost": 0.0
                })
            except Exception as e:
                print("Error parsing line: {} - {}".format(line, str(e)))
                pass
        elif len(parts) >= 6:  # 기존 6개 필드 호환성 유지
            try:
                items.append({
                    "element_type": parts[0],
                    "name": parts[1],
                    "material": parts[2],
                    "carbon_emission": float(parts[3]),
                    "weight": float(parts[4]),
                    "volume": float(parts[5]),
                    "area": 0.0,
                    "material_cost": 0.0
                })
            except:
                pass
    return items

def color_from_value(val, vmin, vmax):
    """Deep Sky Blue → Yellow → Red (Pastel)"""
    if vmax == vmin:
        t = 0.5
    else:
        t = (val - vmin) / float(vmax - vmin)
    t = max(0.0, min(1.0, t))

    if t < 0.5:
        tt = t / 0.5
        r = int(70 + (255 - 70) * tt)
        g = int(130 + (255 - 130) * tt)
        b = int(180 + (0   - 180) * tt)
    else:
        tt = (t - 0.5) / 0.5
        r = 255
        g = int(255 * (1 - tt))
        b = 0

    alpha = 0.7  # pastel blend
    r = int(r * alpha + 255 * (1 - alpha))
    g = int(g * alpha + 255 * (1 - alpha))
    b = int(b * alpha + 255 * (1 - alpha))
    return r, g, b

def mesh_to_json(mesh, carbon_value, vmin, vmax):
    """Mesh → JSON with vertex colors + carbon_values per vertex"""
    vertices = [{"x": v.X, "y": v.Y, "z": v.Z} for v in mesh.Vertices]
    faces = []
    for f in mesh.Faces:
        if f.IsTriangle:
            faces.append([f.A, f.B, f.C])
        else:
            faces.append([f.A, f.B, f.C])
            faces.append([f.A, f.C, f.D])

    r, g, b = color_from_value(carbon_value, vmin, vmax)
    colors = [{"r": r, "g": g, "b": b} for _ in vertices]
    carbon_values = [carbon_value for _ in vertices]

    return {
        "geometry": {
            "vertices": vertices,
            "faces": faces,
            "vertex_colors": colors,
            "carbon_values": carbon_values
        },
        "carbon_value": carbon_value
    }

# ----------------- Main -----------------
a = b = c = None

if enabled:
    url_base = "http://127.0.0.1:8000"
    try:
        geom_list   = geometry if isinstance(geometry, list) else [geometry]
        carbon_list = carbon_values if isinstance(carbon_values, list) else [carbon_values]

        # 연면적 처리
        try:
            area_value = float(total_area) if total_area is not None else 0.0
        except:
            area_value = 0.0

        # 1) TEXT DATA 파싱 (그래프/표용) - carbon_per_m2 포함
        text_items = parse_text(text_data)

        # 2) 컬러링용 값 준비 (geometry 1:1)
        data_items = []
        for i, val in enumerate(carbon_list):
            try:
                cv = float(val) if val is not None else 0.0
            except:
                cv = 0.0
            data_items.append({
                "element_type": f"Element_{i+1}",
                "name": f"Component_{i+1}",
                "material": "Unknown",
                "carbon_values": cv
            })

        # 3) vmin/vmax: 퍼센트(전체 범위 기준)로 자르기
        carbons = [d["carbon_values"] for d in data_items if d.get("carbon_values") is not None]
        if carbons:
            min_all = min(carbons)
            max_all = max(carbons)
            span = max_all - min_all
            # 퍼센트 클리핑 (분포와 무관, 전체 범위 기준)
            low  = max(0.0, min(1.0, LOW_PCT))
            high = max(0.0, min(1.0, HIGH_PCT))
            if high <= low:
                high = min(1.0, low + 0.01)  # 최소 폭 확보

            vmin = min_all + span * low
            vmax = min_all + span * high
            if vmin == vmax:
                vmax = vmin + 1.0
        else:
            vmin, vmax = 0.0, 1.0

        # 4) Mesh 변환 + 색상 매핑 (Extrusion 처리 추가)
        geom_json_list = []
        successful_conversions = 0
        failed_conversions = []
        
        # 디버깅: 처음 5개 타입 출력
        print("\n=== Geometry Types ===")
        for i, g in enumerate(geom_list[:5]):
            if g is not None:
                print("Geometry {}: {}".format(i, type(g).__name__))
        
        for i, g in enumerate(geom_list):
            if g is None:
                failed_conversions.append(("Geometry_{}".format(i), "None object"))
                continue
            
            mesh = None
            geom_type = type(g).__name__
            
            try:
                # ⭐ Extrusion 처리 추가
                if isinstance(g, rg.Extrusion):
                    brep = g.ToBrep()
                    if brep:
                        meshes = rg.Mesh.CreateFromBrep(brep, rg.MeshingParameters.FastRenderMesh)
                        if meshes and len(meshes) > 0:
                            mesh = rg.Mesh()
                            for m in meshes:
                                mesh.Append(m)
                
                # Brep 처리
                elif isinstance(g, rg.Brep):
                    meshes = rg.Mesh.CreateFromBrep(g, rg.MeshingParameters.FastRenderMesh)
                    if meshes and len(meshes) > 0:
                        mesh = rg.Mesh()
                        for m in meshes:
                            mesh.Append(m)
                
                # Mesh 처리
                elif isinstance(g, rg.Mesh):
                    mesh = g
                
                # 기타 지오메트리 타입
                else:
                    failed_conversions.append(("Geometry_{}".format(i), "Unsupported type: {}".format(geom_type)))
                    continue

                # 성공 여부 확인
                if mesh and mesh.Vertices.Count > 0:
                    carbon_val = data_items[i]["carbon_values"] if i < len(data_items) else 0.0
                    geom_json = mesh_to_json(mesh, carbon_val, vmin, vmax)
                    geom_json_list.append(geom_json)
                    successful_conversions += 1
                else:
                    failed_conversions.append(("Geometry_{}".format(i), "No vertices generated"))
                    
            except Exception as e:
                failed_conversions.append(("Geometry_{}".format(i), str(e)))

        # 실패 항목 출력
        if failed_conversions:
            print("\n⚠️ Failed conversions:")
            for name, reason in failed_conversions:
                print("  - {}: {}".format(name, reason))

        # 5) 서버 전송 - 연면적을 별도 필드로
        if text_items:
            resp_data = post_json(url_base + "/data", {
                "data": text_items,
                "total_area": area_value
            })
            a = str(resp_data)
            print("✅ Sent {} items with carbon_per_m2 field".format(len(text_items)))

        if geom_json_list:
            resp_geom = post_json(url_base + "/geometry", {
                "geometry": {
                    "items": geom_json_list,
                    "carbon_range": {"min": vmin, "max": vmax}
                }
            })
            b = str(resp_geom)

        c = "✅ Sent {} text items, {} carbon items ({} geometries), Area: {:.1f} m²\n".format(
            len(text_items), len(data_items), successful_conversions, area_value
        )
        c += "Range (percent): {:.2f}%–{:.2f}% of [{:.3f}, {:.3f}] → vmin={:.3f}, vmax={:.3f}\n".format(
            LOW_PCT*100.0, HIGH_PCT*100.0, 
            min_all if carbons else 0.0, 
            max_all if carbons else 1.0, 
            vmin, vmax
        )
        if failed_conversions:
            c += "⚠️ Failed: {} geometries".format(len(failed_conversions))

    except Exception as e:
        c = "⚠️ Error: {}".format(str(e))
        import traceback
        print(traceback.format_exc())
else:
    c = "⚠️ Component disabled"