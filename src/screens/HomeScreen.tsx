import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { theme } from '@constants/theme';
import { STUDENT, ROOM_LABEL, DEBOUNCE_MS, STALE_TIME_MS, VARIANT } from '@constants/student';
import { productApi, Product } from '@services/productApi';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { ProductCard } from '@components/ProductCard';
import { Watermark } from '@components/Watermark';

// Dùng FlashList từ @shopify/flash-list nếu có, fallback sang FlatList
let FlashListComp: any = FlatList;
try {
  const shopify = require('@shopify/flash-list');
  if (shopify?.FlashList) {
    FlashListComp = shopify.FlashList;
  }
} catch (e) {
  FlashListComp = FlatList;
}

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, DEBOUNCE_MS);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productApi.getProducts(12),
    staleTime: STALE_TIME_MS,
  });

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim()) return products;
    const query = debouncedSearch.toLowerCase().trim();
    return products.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
  }, [products, debouncedSearch]);

  const handleCardPress = (id: number) => {
    navigation.navigate('Detail', { id: String(id) });
  };

  const renderContent = () => {
    // 1. Cảnh mạng: ĐANG TẢI
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Đang tải món...</Text>
        </View>
      );
    }

    // 2. Cảnh mạng: LỖI MẠNG (có MSSV + Thử lại)
    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorMssv}>{STUDENT.mssv}</Text>
          <Text style={styles.errorText}>Không tải được dữ liệu món.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // 3. Cảnh mạng: CÓ DỮ LIỆU LƯỚI (FlashList 2 cột)
    return (
      <FlashListComp
        data={filteredProducts}
        numColumns={2}
        estimatedItemSize={220}
        keyExtractor={(item: Product) => `${STUDENT.mssv}-${item.id}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }: { item: Product }) => (
          <ProductCard
            product={item}
            onPress={() => handleCardPress(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            colors={[theme.primary]}
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header KTXGO + Giao tận {ROOM_LABEL} */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KTXGO</Text>
        <Text style={styles.headerSubtitle}>Giao tận {ROOM_LABEL}</Text>
      </View>

      {/* Ô tìm kiếm controlled, debounce */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
          placeholderTextColor={theme.textLight}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Vùng hiển thị 3 trạng thái mạng */}
      <View style={styles.listWrapper}>{renderContent()}</View>

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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
    marginTop: 4,
    fontWeight: '500',
  },
  searchWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.background,
  },
  searchInput: {
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.text,
  },
  listWrapper: {
    flex: 1,
    backgroundColor: theme.background,
  },
  listContainer: {
    paddingHorizontal: 6,
    paddingBottom: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 15,
    color: theme.text,
    marginTop: 12,
    fontWeight: '500',
  },
  errorMssv: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.error,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 15,
    color: theme.text,
    marginBottom: 18,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.error,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default HomeScreen;
