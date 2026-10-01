import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Vibration } from 'react-native';
import { Product } from '@services/productApi';
import { theme } from '@constants/theme';
import { PRICE_MULTIPLIER, VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const pastelColors = ['#FEF3C7', '#DBEAFE', '#DCFCE7', '#FEE2E2', '#EDE9FE', '#FCE7F3'];

export const triggerHaptic = async () => {
  try {
    let Haptics: any = null;
    try {
      Haptics = require('expo-haptics');
    } catch (e) {
      // module not available
    }

    if (Haptics) {
      if (VARIANT.hapticOnAdd === 'impact') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle?.Medium || 'medium');
      } else {
        await Haptics.selectionAsync();
      }
    } else {
      Vibration.vibrate(40);
    }
  } catch (err) {
    Vibration.vibrate(40);
  }
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const addItem = useCartStore((state) => state.addItem);

  const formattedPrice = (
    Math.round(product.price * PRICE_MULTIPLIER)
  ).toLocaleString('vi-VN') + ' đ';

  const handleAdd = (e: any) => {
    e.stopPropagation?.();
    addItem(product);
    triggerHaptic();
  };

  const bgIndex = product.id % pastelColors.length;
  const imageBgColor = pastelColors[bgIndex];

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={[styles.imageContainer, { backgroundColor: imageBgColor }]}>
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

      <Text style={styles.title} numberOfLines={2}>
        {product.title}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.price}>{formattedPrice}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          activeOpacity={0.7}
        >
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 10,
    margin: 6,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
  },
  imageContainer: {
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  imagePlaceholder: {
    width: 60,
    height: 30,
    backgroundColor: theme.primary,
    borderRadius: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 6,
    minHeight: 36,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
  addButton: {
    backgroundColor: theme.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

export default ProductCard;
