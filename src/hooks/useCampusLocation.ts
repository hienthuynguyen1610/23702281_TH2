import { useState, useCallback } from 'react';
import { Linking, Alert, Platform } from 'react-native';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

// Tọa độ cổng KTX IUH (Ký túc xá Đại học Công nghiệp TP.HCM)
export const KTX_GATE_COORDS = {
  latitude: 10.8222,
  longitude: 106.6875,
};

export type PermissionStatus = 'idle' | 'granted' | 'denied' | 'blocked';

export function calculateHaversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateShipFee(km: number, formula: 'A' | 'B'): number {
  if (formula === 'A') {
    return BASE_SHIP_FEE + Math.round(km * 2000);
  } else {
    return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
  }
}

export function useCampusLocation() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('idle');
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [shipFee, setShipFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const setShippingInfo = useCartStore((state) => state.setShippingInfo);

  const openSettings = useCallback(() => {
    Linking.openSettings().catch(() => {
      Alert.alert('Lỗi', 'Không thể mở Cài đặt hệ thống.');
    });
  }, []);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    try {
      let LocationModule: any = null;
      try {
        LocationModule = require('expo-location');
      } catch (e) {
        // Expo location not linked or not installed
      }

      if (LocationModule && LocationModule.requestForegroundPermissionsAsync) {
        const { status, canAskAgain } =
          await LocationModule.requestForegroundPermissionsAsync();

        if (status === 'granted') {
          setPermissionStatus('granted');
          const loc = await LocationModule.getCurrentPositionAsync({});
          const lat = loc.coords.latitude;
          const lon = loc.coords.longitude;
          const dist = calculateHaversine(
            lat,
            lon,
            KTX_GATE_COORDS.latitude,
            KTX_GATE_COORDS.longitude
          );
          const fee = calculateShipFee(dist, VARIANT.shipFormula);
          setDistanceKm(dist);
          setShipFee(fee);
          setShippingInfo(fee, dist);
        } else if (!canAskAgain) {
          setPermissionStatus('blocked');
          Alert.alert(
            'Quyền vị trí bị chặn',
            'Ứng dụng cần quyền vị trí để ước tính phí ship. Vui lòng mở Cài đặt để cấp quyền.',
            [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Mở Cài đặt', onPress: openSettings },
            ]
          );
        } else {
          setPermissionStatus('denied');
        }
      } else {
        // Fallback / Mock cho môi trường máy ảo hoặc chưa liên kết module
        // Tọa độ giả lập ~1.2 km từ cổng KTX
        const mockLat = KTX_GATE_COORDS.latitude + 0.009;
        const mockLon = KTX_GATE_COORDS.longitude + 0.007;
        const dist = calculateHaversine(
          mockLat,
          mockLon,
          KTX_GATE_COORDS.latitude,
          KTX_GATE_COORDS.longitude
        );
        const fee = calculateShipFee(dist, VARIANT.shipFormula);

        setPermissionStatus('granted');
        setDistanceKm(dist);
        setShipFee(fee);
        setShippingInfo(fee, dist);
      }
    } catch (error) {
      console.warn('Location request error:', error);
      // Fallback
      setPermissionStatus('denied');
    } finally {
      setLoading(false);
    }
  }, [openSettings, setShippingInfo]);

  return {
    permissionStatus,
    distanceKm,
    shipFee,
    loading,
    requestLocation,
    openSettings,
    setPermissionStatus,
  };
}

export default useCampusLocation;
