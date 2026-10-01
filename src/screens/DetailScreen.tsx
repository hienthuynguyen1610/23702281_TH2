import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { theme } from '@constants/theme';
import { STUDENT, PRICE_MULTIPLIER, VARIANT } from '@constants/student';
import { productApi, Product } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import { Watermark } from '@components/Watermark';
import { triggerHaptic } from '@components/ProductCard';

export const DetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params || {};

  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product);
    triggerHaptic();
    Alert.alert(
      'KTXGo',
      `Đã thêm món vào giỏ hàng thành công!\nMSSV: ${STUDENT.mssv}`
    );
  };

  const formattedPrice = product
    ? (Math.round(product.price * PRICE_MULTIPLIER)).toLocaleString('vi-VN') + ' đ'
    : '';

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header điều hướng */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Chi tiết món</Text>
        </TouchableOpacity>
        <Text style={styles.stackLabel}>Stack</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Đang tải chi tiết món...</Text>
        </View>
      ) : isError || !product ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Không tìm thấy thông tin món (ID: {id}).
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Vùng ảnh lớn */}
          <View style={styles.imageCard}>
            {product.image ? (
              <Image
                source={{ uri: product.image }}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
          </View>

          {/* Tên sản phẩm */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Giá quy đổi */}
          <Text style={styles.price}>{formattedPrice}</Text>

          {/* Phụ đề giao hàng */}
          <Text style={styles.subtitle}>Giao nội khu · nhận tận phòng</Text>

          {/* Mô tả từ API tối đa 3 dòng */}
          <View style={styles.descriptionBox}>
            <Text style={styles.description} numberOfLines={3}>
              {product.description ||
                'Mô tả ngắn từ API (tối đa 3 dòng). Giữ nguyên id từ route.params.'}
            </Text>
          </View>

          {/* Nút Thêm vào giỏ · Haptic */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>Thêm vào giỏ · Haptic</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.surface,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.primary,
  },
  stackLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.secondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  imageCard: {
    width: '100%',
    height: 220,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
  },
  image: {
    width: '90%',
    height: '90%',
  },
  imagePlaceholder: {
    width: 140,
    height: 80,
    backgroundColor: theme.primary,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textLight,
    marginBottom: 16,
  },
  descriptionBox: {
    width: '100%',
    backgroundColor: theme.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.textLight,
    textAlign: 'left',
  },
  addButton: {
    width: '100%',
    backgroundColor: theme.primary,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 15,
    color: theme.text,
    marginTop: 12,
  },
  errorText: {
    fontSize: 15,
    color: theme.error,
  },
});

export default DetailScreen;
