function getGeolocationError(code) {
  switch (code) {
    case 1: return 'Пользователь отказал в доступе к геолокации';
    case 2: return 'Не удалось определить местоположение';
    case 3: return 'Время ожидания истекло';
    default: return 'Неизвестная ошибка геолокации';
  }
}

/**
 * Получение координат через браузерный GPS
 */
function getGPSCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Браузер не поддерживает геолокацию'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || null,
          timestamp: position.timestamp,
          source: 'browser_gps'
        });
      },
      (error) => {
        reject(new Error(getGeolocationError(error.code)));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Геокодирование через OpenCage 
 * Нужен API ключ
 */
async function getAddressByOpenCage(lat, lon) {
  // Ключ можно получить на https://opencagedata.com/api
  const API_KEY = 'f30078baa6894e0d8c0d3ebf76206367'; // Это тестовый/для_учебных_проектов ключ OpenCage
  
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${API_KEY}&language=ru&pretty=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results[0]) {
      const comp = data.results[0].components;
      return {
        full: data.results[0].formatted,
        city: comp.city || comp.town || comp.village || comp.municipality || '',
        road: comp.road || comp.street || '',
        houseNumber: comp.house_number || '',
        suburb: comp.suburb || '',
        postcode: comp.postcode || '',
        country: comp.country || '',
        countryCode: comp.country_code || ''
      };
    }
    throw new Error('Адрес не найден');
  } catch (error) {
    throw new Error(`OpenCage: ${error.message}`);
  }
}

/**
 * Геокодирование через встроенный браузерный API
 */
async function getAddressByBrowserGeocoder(lat, lon) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16`);
    
    if (response.ok) {
      const data = await response.json();
      
      if (!data.address) {
        throw new Error('Адрес не найден в ответе');
      }
      
      return {
        full: data.display_name || '',
        city: data.address.city || data.address.town || '',
        road: data.address.road || '',
        country: data.address.country || ''
      };
    }
    
    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    throw new Error(`Браузерный геокодер: ${error.message}`);
  }
}

// ====================================================
// УРОВЕНЬ 0: SETTINGS
// ====================================================

const CONFIG = {
  STORAGE_KEY: 'weatherLocationData',
  
  // Уровни точности методов
  ACCURACY: {
    HIGH: 'high',     // GPS + адрес (улица)
    MEDIUM: 'medium', // GPS координаты
    LOW: 'low',       // IP-геолокация (город)
    FALLBACK: 'fallback' // Резервные данные
  }
};

// Глобальное состояние
let currentMethod = null;
let isProcessing = false;

// ====================================================
// УРОВЕНЬ 1: ВЫСОКАЯ ТОЧНОСТЬ (GPS + Адрес)
// ====================================================

/**
 * Метод 1.1: GPS + OpenCage Geocoder (
 * Требует API ключ
 */
async function getLocationByGPSAndGeocoding() {
  console.log('[Уровень 1.1] Пробуем: GPS + OpenCage Geocoder');
  
  try {
    // 1. Получаем точные координаты через GPS
    const coords = await getGPSCoordinates();
    console.log('✓ Координаты GPS:', coords.latitude, coords.longitude);
    
    // 2. Преобразуем в адрес через OpenCage 
    const address = await getAddressByOpenCage(coords.latitude, coords.longitude);
    console.log('✓ Адрес от OpenCage:', address.city, address.road);
    
    const result = {
      method: 'gps_opencage',
      accuracy: CONFIG.ACCURACY.HIGH,
      timestamp: new Date().toISOString(),
      hasStreet: !!address.road,
      coords: coords,
      address: address,
      success: true,
      note: 'Точные координаты GPS + детальный адрес'
    };
    
    console.log('✅ Уровень 1.1 успешен!');
    return result;
    
  } catch (error) {
    console.warn('❌ Уровень 1.1 не сработал:', error.message);
    throw error;
  }
}

/**
 * Метод 1.2: GPS + Браузерный геокодер (встроен в браузер)
 */
async function getLocationByGPSAndBrowser() {
  console.log('[Уровень 1.2] Пробуем: GPS + Браузерный геокодер');
  
  try {
    // Получаем координаты
    const coords = await getGPSCoordinates();
    console.log('✓ Координаты GPS:', coords.latitude, coords.longitude);
    
    // Используем встроенный геокодер браузера
    const address = await getAddressByBrowserGeocoder(coords.latitude, coords.longitude);
    
    const result = {
      method: 'gps_browser',
      accuracy: CONFIG.ACCURACY.HIGH,
      timestamp: new Date().toISOString(),
      hasStreet: !!address.road,
      coords: coords,
      address: address,
      success: true,
      note: 'Координаты GPS + браузерный геокодер'
    };
    
    console.log('✅ Уровень 1.2 успешен!');
    return result;
    
  } catch (error) {
    console.warn('❌ Уровень 1.2 не сработал:', error.message);
    throw error;
  }
}

// ====================================================
// УРОВЕНЬ 2: СРЕДНЯЯ ТОЧНОСТЬ (Только координаты)
// ====================================================

/**
 * Метод 2.1: Только GPS координаты
 */
async function getLocationByGPSOnly() {
  console.log('[Уровень 2] Пробуем: Только GPS координаты');
  
  try {
    const coords = await getGPSCoordinates();
    console.log('✓ Координаты GPS:', coords.latitude, coords.longitude);
    
    const result = {
      method: 'gps_only',
      accuracy: CONFIG.ACCURACY.MEDIUM,
      timestamp: new Date().toISOString(),
      hasStreet: false,
      coords: coords,
      address: {
        city: 'Только координаты',
        full: `Широта: ${coords.latitude.toFixed(4)}, Долгота: ${coords.longitude.toFixed(4)}`,
        note: 'Для получения города используйте IP-геолокацию'
      },
      success: true,
      note: 'Точные координаты GPS (без адреса)'
    };
    
    console.log('✅ Уровень 2 успешен!');
    return result;
    
  } catch (error) {
    console.warn('❌ Уровень 2 не сработал:', error.message);
    throw error;
  }
}

// ====================================================
// УРОВЕНЬ 3: НИЗКАЯ ТОЧНОСТЬ (IP-геолокация)
// ====================================================

/**
 * Метод 3.1: IP-геолокация (geo.js - самый надежный, без ограничений)
 */
async function getLocationByIPGeoJS() {
  console.log('[Уровень 3.1] Пробуем: IP-геолокация (geo.js)');
  
  try {
    const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    if (!data.city) throw new Error('Город не определен');
    
    const result = {
      method: 'ip_geojs',
      accuracy: CONFIG.ACCURACY.LOW,
      timestamp: new Date().toISOString(),
      hasStreet: false,
      coords: {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        accuracy: null,
        source: 'ip_geojs',
        ip: data.ip
      },
      address: {
        city: data.city,
        region: data.region,
        country: data.country,
        full: `${data.city}, ${data.region}, ${data.country}`,
        ip: data.ip
      },
      success: true,
      note: 'Определено по IP-адресу (geo.js)'
    };
    
    console.log('✅ Уровень 3.1 успешен! Город:', data.city);
    return result;
    
  } catch (error) {
    console.warn('❌ Уровень 3.1 не сработал:', error.message);
    throw error;
  }
}

/**
 * Метод 3.2: IP-геолокация 
 */
async function getLocationByIPApi() {
  console.log('[Уровень 3.2] Пробуем: IP-геолокация (ipapi.co)');
  
  try {
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    if (!data.city || !data.country || !data.country_name) {
        throw new Error('IP сервис не вернул полные данные');
    }
    const result = {
      method: 'ip_ipapi',
      accuracy: CONFIG.ACCURACY.LOW,
      timestamp: new Date().toISOString(),
      hasStreet: false,
      coords: {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        accuracy: null,
        source: 'ip_ipapi',
        ip: data.ip
      },
      address: {
        city: data.city,
        region: data.region,
        country: data.country_name,
        full: `${data.city}, ${data.region}, ${data.country_name}`,
        ip: data.ip
      },
      success: true,
      note: 'Определено по IP-адресу (ipapi.co)'
    };
    
    console.log('✅ Уровень 3.2 успешен! Город:', data.city);
    return result;
    
  } catch (error) {
    console.warn('❌ Уровень 3.2 не сработал:', error.message);
    throw error;
  }
}

/**
 * Метод 3.3: IP-геолокация 
 */
async function getLocationByIPAPI() {
  console.log('[Уровень 3.3] Пробуем: IP-геолокация (ip-api.com)');
  
  try {
    const response = await fetch('http://ip-api.com/json/?lang=ru&fields=country,regionName,city,lat,lon,query');
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    if (!data.city || !data.country) {
      throw new Error('IP сервис не вернул полные данные');
    }
    
    const result = {
      method: 'ip_api_com',
      accuracy: CONFIG.ACCURACY.LOW,
      timestamp: new Date().toISOString(),
      hasStreet: false,
      coords: {
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon),
        accuracy: null,
        source: 'ip_api_com',
        ip: data.query
      },
      address: {
        city: data.city,
        region: data.regionName,
        country: data.country,
        full: `${data.city}, ${data.regionName}, ${data.country}`,
        ip: data.query
      },
      success: true,
      note: 'Определено по IP-адресу (ip-api.com)'
    };
    
    console.log('✅ Уровень 3.3 успешен! Город:', data.city);
    return result;
    
  } catch (error) {
    console.warn('❌ Уровень 3.3 не сработал:', error.message);
    throw error;
  }
}

// ====================================================
// УРОВЕНЬ 4: АВАРИЙНЫЙ РЕЗЕРВ
// ====================================================

/**
 * Метод 4: Приблизительное определение по данным браузера
 */
async function getLocationFallback() {
  console.log('[Уровень 4] Пробуем: Приблизительное определение');
  
  const userLanguage = navigator.language || 'ru-RU';
  const userCountry = userLanguage.split('-')[1] || 'RU';
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const defaultCities = {
    'RU': { city: 'Москва', lat: 55.7558, lon: 37.6173 },
    'UA': { city: 'Киев', lat: 50.4501, lon: 30.5234 },
    'BY': { city: 'Минск', lat: 53.9045, lon: 27.5615 },
    'KZ': { city: 'Алматы', lat: 43.2389, lon: 76.8897 },
    'US': { city: 'Нью-Йорк', lat: 40.7128, lon: -74.0060 },
    'GB': { city: 'Лондон', lat: 51.5074, lon: -0.1278 },
    'DE': { city: 'Берлин', lat: 52.5200, lon: 13.4050 },
    'FR': { city: 'Париж', lat: 48.8566, lon: 2.3522 }
  };
  
  let determinedCity = defaultCities[userCountry] || defaultCities['RU'];
  
  if (userTimezone.includes('/')) {
    const cityFromTZ = {
      'Moscow': 'Москва', 'London': 'Лондон', 'Berlin': 'Берлин',
      'Paris': 'Париж', 'New_York': 'Нью-Йорк', 'Tokyo': 'Токио'
    };
    
    const tzCity = userTimezone.split('/')[1];
    if (cityFromTZ[tzCity]) {
      for (const country in defaultCities) {
        if (defaultCities[country].city === cityFromTZ[tzCity]) {
          determinedCity = defaultCities[country];
          break;
        }
      }
    }
  }
  
  const result = {
    method: 'fallback_approximate',
    accuracy: CONFIG.ACCURACY.FALLBACK,
    timestamp: new Date().toISOString(),
    hasStreet: false,
    coords: {
      latitude: determinedCity.lat,
      longitude: determinedCity.lon,
      accuracy: null,
      source: 'browser_data'
    },
    address: {
      city: determinedCity.city,
      country: userCountry,
      full: `${determinedCity.city} (приблизительно)`,
      note: `По данным браузера: ${userLanguage}, ${userTimezone}`
    },
    success: true,
    note: 'Приблизительное определение'
  };
  
  saveLocationToStorage(result);
  
  return result;
}

// ====================================================
// ОСНОВНОЙ КОНТРОЛЛЕР С ПРИОРИТЕТАМИ
// ====================================================

/**
 * Главная функция: пробует все методы от самого точного к самому надежному
 */


//============================================================================================================================================================================
//============================================================================================================================================================================
//============================================================================================================================================================================

async function detectLocationWithPriority() {
  if (isProcessing) {
    console.warn('⚠️ Детекция уже выполняется');
    return null;
  }
  
  isProcessing = true;
  console.log('🚀 Начинаем многоуровневое определение местоположения...');
  
  // ВСЕ методы в порядке приоритета
  const methods = [
    // Уровень 1: Высокая точность (GPS + адрес)
    { name: 'GPS + OpenCage', func: getLocationByGPSAndGeocoding, priority: 1 }, // (ВСЕ) И (РАБОТАЕТ НА РУСС), но погрешность 16км
    { name: 'GPS + Браузер', func: getLocationByGPSAndBrowser, priority: 2 }, // (Все кроме района) И (РАБОТАЕТ НА РУСС), но погрешность 16км

    // Уровень 3: Низкая точность (IP-геолокация)
    { name: 'IP ip-api.com', func: getLocationByIPAPI, priority: 3 }, //(страна и город) И (РАБОТАЕТ НА РУСС), но погрешность ..км
    { name: 'IP geo.js', func: getLocationByIPGeoJS, priority: 4 }, // (страна и город) И (РАБОТАЕТ НА АНГЛ), но погрешность ..км
    // { name: 'IP ipapi.co', func: getLocationByIPApi, priority: 5 }, // НЕ РАБОТАЛ ХУЙНЯ БЕЗ МАМНАЯ

        // Уровень 4/0: Аварийный резерв
    { name: 'Резервные данные', func: getLocationFallback, priority: 6 }, // (страна и город) И (РАБОТАЕТ, но СТРАНА "RU", а город НА РУСС), но погрешность ..км

    // Уровень 2: Средняя точность (только GPS)
    { name: 'Только GPS', func: getLocationByGPSOnly, priority: 7 }, // (ВООБЩЕ ХУЙНЯ ТОЛЬКО С КООРДИНАТАММ) И (РАБОТАЕТ, НО КРИВО НА РУСС), но погрешность ..км
  ];
//============================================================================================================================================================================
//============================================================================================================================================================================
//============================================================================================================================================================================

  let result = null;
  let attempts = [];
  
  for (let i = 0; i < methods.length; i++) {
    const method = methods[i];
    
    try {
      console.log(`\n[Попытка ${i + 1}/${methods.length}] ${method.name}`);
      result = await method.func();
      
      currentMethod = result.method;
      attempts.push({ method: method.name, success: true, priority: method.priority });
      
      console.log(`🎉 Успех через ${method.name}!`);
      
      // Сохраняем в sessionStorage
      saveLocationToStorage(result);
      
      // Прерываем на первом успешном
      break;
      
    } catch (error) {
      attempts.push({ 
        method: method.name, 
        success: false, 
        priority: method.priority,
        error: error.message 
      });
      
      console.warn(`❌ ${method.name} не сработал:`, error.message);
      
      // Задержка перед следующей попыткой (кроме последней)
      if (i < methods.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }
  }
  
  // Логируем все попытки
  console.log('\n📊 Итог всех попыток:');
  attempts.forEach(attempt => {
    console.log(`${attempt.success ? '✅' : '❌'} ${attempt.method} (приоритет ${attempt.priority})`);
  });
  
  isProcessing = false;
  return result;
}

// ====================================================
// РАБОТА С SESSIONSTORAGE
// ====================================================

/**
 * Сохраняет данные в sessionStorage
 */
function saveLocationToStorage(data) {
  try {
    const storageData = {
      ...data,
      storageTimestamp: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 50),
      platform: navigator.platform
    };
    
    sessionStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(storageData));
    
    console.log(`💾 Сохранено в sessionStorage: ${data.method} (${data.accuracy})`);
    console.log(`📍 Город: ${data.address?.city || 'нет'}, Улица: ${data.hasStreet ? 'да' : 'нет'}`);
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка сохранения:', error);
    return false;
  }
}

/**
 * Загружает данные из sessionStorage
 */
function loadLocationFromStorage() {
  try {
    const data = sessionStorage.getItem(CONFIG.STORAGE_KEY);
    if (!data) {
      console.log('📭 sessionStorage пуст');
      return null;
    }
    
    const parsed = JSON.parse(data);
    
    // Проверяем свежесть данных (30 минут) (Если все будет работать без этого куска то убери, скорее всего только будет нагружать память)
    const storedTime = new Date(parsed.timestamp || parsed.storageTimestamp);
    const now = new Date();
    const minutesDiff = (now - storedTime) / (1000 * 60);
    
    if (minutesDiff > 30) {
      console.log('🕒 Данные устарели (>30 минут)');
      clearLocationStorage();
      return null;
    }
    
    console.log(`📂 Загружено из sessionStorage: ${parsed.method}`);
    return parsed;
    
  } catch (error) {
    console.error('❌ Ошибка загрузки:', error);
    return null;
  }
}

/**
 * Очищает sessionStorage
 */
function clearLocationStorage() {
  try {
    sessionStorage.removeItem(CONFIG.STORAGE_KEY);
    console.log('🧹 sessionStorage очищен');
    return true;
  } catch (error) {
    console.error('❌ Ошибка очистки:', error);
    return false;
  }
}

/**
 * Проверяет наличие сохраненных данных
 */
function hasLocationInStorage() {
  return loadLocationFromStorage() !== null;
}

// ====================================================
// ПУБЛИЧНЫЙ API
// ====================================================

/**
 * Основной публичный метод
 */
async function getLocation(forceRefresh = false) {
  // Используем кэш если есть и не форсируем обновление
  if (!forceRefresh) {
    const cached = loadLocationFromStorage();
    if (cached) {
      console.log('🔄 Используем кэшированные данные');
      return cached;
    }
  }
  
  // Получаем новые данные
  return await detectLocationWithPriority();
}

/**
 * Получает краткую информацию о местоположении
 */
async function getSimpleLocation() {
  const data = await getLocation();
  
  if (!data || !data.success) {
    return { error: 'Не удалось определить местоположение' };
  }
  
  return {
    city: data.address?.city || 'Неизвестно',
    country: data.address?.country || '',
    latitude: data.coords?.latitude || null,
    longitude: data.coords?.longitude || null,
    hasStreet: data.hasStreet || false,
    method: data.method,
    accuracy: data.accuracy,
    timestamp: data.timestamp
  };
}

/**
 * Сбрасывает сервис
 */
function resetLocationService() {
  currentMethod = null;
  isProcessing = false;
  clearLocationStorage();
  console.log('♻️ Сервис сброшен');
}

// ====================================================
// ЭКСПОРТ И ИНИЦИАЛИЗАЦИЯ
// ====================================================

// Экспортируем публичное API
const LocationService = {
  // Основные методы
  getLocation: getLocation,
  getSimpleLocation: getSimpleLocation,
  reset: resetLocationService,
  
  // Работа с хранилищем
  hasCachedLocation: hasLocationInStorage,
  clearCache: clearLocationStorage,
  getCachedLocation: loadLocationFromStorage,
  
  // Информация
  getCurrentMethod: () => currentMethod,
  isProcessing: () => isProcessing,
  
  // Конфигурация
  config: CONFIG,
  
  // Методы для ручного тестирования (отладка)
  testMethods: {
    testGPSGeocoding: getLocationByGPSAndGeocoding,
    testGPSOnly: getLocationByGPSOnly,
    testIPGeoJS: getLocationByIPGeoJS,
    testIPApi: getLocationByIPApi,
    testFallback: getLocationFallback
  }
};

// Делаем доступным глобально
if (typeof window !== 'undefined') {
  window.LocationService = LocationService;
  console.log('📍 LocationService готов к работе!');
  console.log('📋 Доступные методы:');
  console.log('  - LocationService.getLocation() - основная функция');
  console.log('  - LocationService.getSimpleLocation() - краткие данные');
  console.log('  - LocationService.reset() - сброс сервиса');
}

// Для Node.js/модулей
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocationService;
}

// Автоматическая проверка при загрузке
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 Браузер поддерживает геолокацию:', !!navigator.geolocation);
    if (!!navigator.geolocation != true) {
      alert("Из-за поддержек вашего браузера, некоторые функции, могут быть отключены")
    }
    console.log('💾 В sessionStorage есть данные:', hasLocationInStorage());
  });

}
