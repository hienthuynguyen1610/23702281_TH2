import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { theme } from '@constants/theme';
import { STUDENT, ROOM_LABEL, PRICE_MULTIPLIER, VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';
import { Watermark } from '@components/Watermark';

export const CartScreen: React.FC = () => {
  const items = useCartStore((state) => state.items);
  const shipFee = useCartStore((state) => state.shipFee);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalAmount = useCartStore((state) => state.totalAmount());

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header Giỏ hàng */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Giỏ hàng đang trống.</Text>
            <Text style={styles.emptySubText}>
              Hãy thêm món từ Cửa hàng để giao tận {ROOM_LABEL}!
            </Text>
          </View>
        ) : (
          <>
            {/* Danh sách món trong giỏ */}
            {items.map((item) => {
              const itemTotal =
                Math.round(item.product.price * PRICE_MULTIPLIER) * item.quantity;
              return (
                <View key={`${STUDENT.mssv}-${item.product.id}`} style={styles.itemCard}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.product.title}
                    </Text>
                    <Text style={styles.itemPriceDetail}>
                      ×{item.quantity}  {itemTotal.toLocaleString('vi-VN')} đ
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeItem(item.product.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Khung thông tin giao nhận + Phí ship */}
            <View style={styles.deliveryCard}>
              <Text style={styles.deliveryTitle}>Giao đến {ROOM_LABEL}</Text>
              {shipFee !== null ? (
                <Text style={styles.deliveryFee}>
                  Phí ship: {shipFee.toLocaleString('vi-VN')} đ (công thức {VARIANT.shipFormula})
                </Text>
              ) : (
                <Text style={styles.deliveryFeeEmpty}>
                  Chưa ước tính phí ship (vào tab Tôi để tính)
                </Text>
              )}
            </View>

            {/* Tổng hàng */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                Tổng hàng: {totalAmount.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </>
        )}
      </ScrollView>

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
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: theme.textLight,
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: theme.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },
  itemPriceDetail: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textLight,
  },
  deleteButton: {
    backgroundColor: theme.error,
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryCard: {
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.secondary,
    borderRadius: 14,
    padding: 16,
    marginVertical: 14,
  },
  deliveryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 6,
  },
  deliveryFee: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.secondary,
  },
  deliveryFeeEmpty: {
    fontSize: 13,
    color: theme.textLight,
    fontStyle: 'italic',
  },
  totalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.primary,
  },
});

export default CartScreen;
