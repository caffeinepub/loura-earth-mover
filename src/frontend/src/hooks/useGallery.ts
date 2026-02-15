import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';
import type { GalleryImageMetadata, GalleryImage } from '../backend';

export function useListGalleryImages() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryImageMetadata[]>({
    queryKey: ['galleryImages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGalleryImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGalleryImage(id: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryImage | null>({
    queryKey: ['galleryImage', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getGalleryImage(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useUploadGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      filename,
      blob,
      alt,
    }: {
      id: string;
      filename: string;
      blob: ExternalBlob;
      alt?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.uploadGalleryImage(id, filename, blob, alt || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    },
  });
}

export function useDeleteGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteGalleryImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    },
  });
}
