import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { theme } from '@constants/theme';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { useAuthStore } from '@stores/authStore';
import { Watermark } from '@components/Watermark';

export const MeScreen: React.FC = () => {
  const stamp = examStamp();
  const logout = useAuthStore((state) => state.logout);
  const {
    permissionStatus,
    distanceKm,
    shipFee,
    loading,
    requestLocation,
    openSettings,
  } = useCampusLocation();

  const getStatusColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return theme.success;
      case 'blocked':
      case 'denied':
        return theme.error;
      default:
        return theme.textLight;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header Tôi - Location */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TÔI · LOCATION</Text>
      </View>

      <View style={styles.content}>
        {/* Thẻ định danh sinh viên */}
        <View style={styles.studentCard}>
          <Text style={styles.studentName}>{STUDENT.hoTen}</Text>
          <Text style={styles.studentSub}>
            {STUDENT.mssv} · #{stamp}
          </Text>
        </View>

        {/* Thẻ quyền vị trí và phí ship */}
        <View style={styles.locationCard}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            Quyền: {permissionStatus === 'idle' ? 'chưa kiểm tra' : permissionStatus}
          </Text>

          <Text style={styles.distanceText}>
            {distanceKm !== null
              ? `≈ ${distanceKm.toFixed(1)} km tới cổng KTX`
              : 'Chưa có tọa độ GPS'}
          </Text>

          <Text style={styles.feeLabel}>Phí ship ước tính</Text>
          <Text style={styles.feeValue}>
            {shipFee !== null
              ? `${shipFee.toLocaleString('vi-VN')} đ`
              : '0 đ'}
          </Text>
        </View>

        {/* Các nút hành động */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={requestLocation}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Lấy vị trí ước tính ship</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={openSettings}
            activeOpacity={0.7}
          >
            <Text style={styles.outlineButtonText}>Mở Cài đặt (blocked)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    backgroundColor: theme.primary,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  studentCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 16,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.text,
    letterSpacing: 0.5,
  },
  studentSub: {
    fontSize: 14,
    color: theme.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  locationCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 15,
    color: theme.text,
    fontWeight: '600',
    marginBottom: 12,
  },
  feeLabel: {
    fontSize: 13,
    color: theme.textLight,
  },
  feeValue: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.secondary,
    marginTop: 4,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: theme.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  outlineButton: {
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: theme.error,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MeScreen;
