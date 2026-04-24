// 탄소 배출량 계산 로직

class CarbonCalculator {
  constructor() {
    this.assemblies = [];
  }

  // 단일 레이어의 탄소 배출량 계산
  calculateLayerCarbon(material, thickness, area = 1) {
    // thickness: mm 단위
    // area: m² 단위
    // 결과: kg CO2eq

    const unit = String(material.unit || '').toLowerCase();

    // m² 단위 자재 (천장, 창호 등): GWP × 면적
    if (unit.includes('m²') || unit.includes('m2')) {
      return material.gwp * area;
    }

    // m³ 단위 자재: GWP × 부피
    const thicknessInMeters = thickness / 1000; // mm를 m로 변환
    const volume = thicknessInMeters * area; // m³

    return material.gwp * volume;
  }

  // 어셈블리 전체 탄소 배출량 계산
  calculateAssemblyCarbon(layers, area = 1) {
    let totalCarbon = 0;
    
    layers.forEach(layer => {
      const carbon = this.calculateLayerCarbon(
        layer.material,
        layer.thickness,
        area
      );
      totalCarbon += carbon;
    });
    
    return totalCarbon;
  }

  // 어셈블리 추가
  addAssembly(name, structureType, layers, area = 1) {
    const assembly = {
      id: Date.now(),
      name: name,
      structureType: structureType,
      layers: layers,
      area: area,
      totalCarbon: this.calculateAssemblyCarbon(layers, area),
      createdAt: new Date().toISOString()
    };
    
    this.assemblies.push(assembly);
    this.saveToLocalStorage();
    return assembly;
  }

  // 어셈블리 삭제
  removeAssembly(id) {
    this.assemblies = this.assemblies.filter(a => a.id !== id);
    this.saveToLocalStorage();
  }

  // 어셈블리 수정
  updateAssembly(id, updates) {
    const index = this.assemblies.findIndex(a => a.id === id);
    if (index !== -1) {
      this.assemblies[index] = {
        ...this.assemblies[index],
        ...updates
      };
      
      // 탄소 배출량 재계산
      this.assemblies[index].totalCarbon = this.calculateAssemblyCarbon(
        this.assemblies[index].layers,
        this.assemblies[index].area
      );
      
      this.saveToLocalStorage();
      return this.assemblies[index];
    }
    return null;
  }

  // 모든 어셈블리 가져오기
  getAllAssemblies() {
    return this.assemblies;
  }

  // 특정 구조 타입의 어셈블리 가져오기
  getAssembliesByType(structureType) {
    return this.assemblies.filter(a => a.structureType === structureType);
  }

  // LocalStorage에 저장
  saveToLocalStorage() {
    try {
      localStorage.setItem('jcode_assemblies', JSON.stringify(this.assemblies));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert('저장 공간이 부족합니다. 일부 어셈블리를 삭제해주세요.');
      }
    }
  }

  // LocalStorage에서 불러오기
  loadFromLocalStorage() {
    const data = localStorage.getItem('jcode_assemblies');
    if (data) {
      try {
        this.assemblies = JSON.parse(data);
      } catch (e) {
        console.error('Failed to load assemblies:', e);
        this.assemblies = [];
      }
    }
  }

  // 통계 계산
  getStatistics() {
    if (this.assemblies.length === 0) {
      return {
        total: 0,
        average: 0,
        min: 0,
        max: 0,
        count: 0
      };
    }

    const carbons = this.assemblies.map(a => a.totalCarbon);
    
    return {
      total: carbons.reduce((sum, c) => sum + c, 0),
      average: carbons.reduce((sum, c) => sum + c, 0) / carbons.length,
      min: Math.min(...carbons),
      max: Math.max(...carbons),
      count: this.assemblies.length
    };
  }

  // 비교 분석
  compareAssemblies(assemblyIds) {
    const selected = this.assemblies.filter(a => assemblyIds.includes(a.id));
    
    if (selected.length === 0) return null;
    
    const carbons = selected.map(a => a.totalCarbon);
    const min = Math.min(...carbons);
    const max = Math.max(...carbons);
    
    return selected.map(assembly => ({
      ...assembly,
      percentageOfMax: (assembly.totalCarbon / max) * 100,
      differenceFromMin: assembly.totalCarbon - min,
      percentDifferenceFromMin: ((assembly.totalCarbon - min) / min) * 100
    }));
  }

  // 데이터 내보내기 (CSV)
  exportToCSV() {
    if (this.assemblies.length === 0) return '';
    
    const headers = [
      'ID',
      'Name',
      'Structure Type',
      'Area (m²)',
      'Total Carbon (kg CO2eq)',
      'Carbon per m² (kg CO2eq/m²)',
      'Layers',
      'Created At'
    ];
    
    const rows = this.assemblies.map(assembly => {
      const layersStr = assembly.layers.map(l => 
        `${l.material.name}(${l.thickness}mm)`
      ).join('; ');
      
      return [
        assembly.id,
        assembly.name,
        assembly.structureType,
        assembly.area.toFixed(2),
        assembly.totalCarbon.toFixed(2),
        (assembly.totalCarbon / assembly.area).toFixed(2),
        layersStr,
        new Date(assembly.createdAt).toLocaleString('ko-KR')
      ];
    });
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  // 데이터 지우기
  clearAll() {
    this.assemblies = [];
    this.saveToLocalStorage();
  }
}

// 유틸리티 함수들

// 숫자를 천 단위로 포맷팅
function formatNumber(num, decimals = 2) {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 탄소 배출량을 색상으로 변환 (낮을수록 녹색, 높을수록 빨간색)
function getCarbonColor(carbon, min, max) {
  const normalized = (carbon - min) / (max - min);
  
  if (normalized < 0.33) {
    return '#00b894'; // 녹색 (낮음)
  } else if (normalized < 0.66) {
    return '#fdcb6e'; // 노란색 (중간)
  } else {
    return '#d63031'; // 빨간색 (높음)
  }
}

// CSV 다운로드
function downloadCSV(csvContent, filename = 'assemblies.csv') {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 자재를 카테고리별로 그룹화
function groupMaterialsByCategory(materials) {
  const grouped = {};
  
  materials.forEach(material => {
    if (!grouped[material.category]) {
      grouped[material.category] = [];
    }
    grouped[material.category].push(material);
  });
  
  // 각 카테고리를 GWP 순으로 정렬
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.gwp - b.gwp);
  });
  
  return grouped;
}

// 구조 타입 이름 변환
function getStructureTypeName(type) {
  const names = {
    floor: '바닥 구조',
    external: '외벽 구조',
    internal: '내벽 구조',
    ceiling: '천장'
  };
  return names[type] || type;
}

// 구조 타입 아이콘
function getStructureTypeIcon(type) {
  const icons = {
    floor: '🏗️',
    external: '🏢',
    internal: '🚪',
    ceiling: '⬜'
  };
  return icons[type] || '📦';
}

// 날짜 포맷팅
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 전역 계산기 인스턴스
const calculator = new CarbonCalculator();
calculator.loadFromLocalStorage();
