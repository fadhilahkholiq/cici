"use client";

import { useShortMaxRekomendasi } from "@/hooks/useShortMax";
import { UnifiedMediaCard } from "./UnifiedMediaCard";
import { UnifiedMediaCardSkeleton } from "./UnifiedMediaCardSkeleton";
import { UnifiedErrorDisplay } from "./UnifiedErrorDisplay";
import { InfiniteShortMaxSection } from "./InfiniteShortMaxSection";

function ShortMaxSectionSkeleton() {
  return (
    <section className="space-y-4">
      <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <UnifiedMediaCardSkeleton key={i} index={i} />
        ))}
      </div>
    </section>
  );
}

function formatCollectNum(num: number): string {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}w`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function ShortMaxHome() {
  const {
    data: rekomendasiData,
    isLoading: loadingRekomendasi,
    error: errorRekomendasi,
    refetch: refetchRekomendasi,
  } = useShortMaxRekomendasi();

  if (errorRekomendasi) {
    return (
      <UnifiedErrorDisplay
        title="Gagal Memuat ShortMax"
        message="Tidak dapat terhubung ke layanan ShortMax."
        onRetry={() => refetchRekomendasi()}
      />
    );
  }

  if (loadingRekomendasi) {
    return (
      <div className="space-y-8 animate-fade-in">
        <ShortMaxSectionSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Rekomendasi Section */}
      {rekomendasiData?.data && rekomendasiData.data.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold text-xl md:text-2xl text-foreground">
              Rekomendasi
            </h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
            {rekomendasiData.data.map((drama, index) => (
              <UnifiedMediaCard
                key={`rekomendasi-${drama.shortPlayId}-${index}`}
                index={index}
                title={drama.title}
                cover={drama.cover}
                link={`/detail/shortmax/${drama.shortPlayId}`}
                episodes={drama.totalEpisodes}
                topLeftBadge={drama.label ? {
                  text: drama.label,
                  color: drama.label === "Hot" ? "#E52E2E" : "#6366f1"
                } : null}
              />
            ))}
          </div>
        </section>
      )}

      {/* Infinite Scroll Section */}
      <InfiniteShortMaxSection title="Lainnya" />

      {!loadingRekomendasi && !rekomendasiData?.data?.length && (
        <div className="text-center py-20 text-muted-foreground">
          Tidak ada konten tersedia saat ini.
        </div>
      )}
    </div>
  );
}
