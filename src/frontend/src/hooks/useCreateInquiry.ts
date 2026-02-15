import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ServiceType } from '../backend';

interface CreateInquiryParams {
  name: string;
  email: string;
  phone: string | null;
  service: string;
  location: string | null;
  message: string;
}

export function useCreateInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateInquiryParams) => {
      if (!actor) {
        throw new Error('Actor not available');
      }

      const serviceType: ServiceType = ServiceType.exteriorWashing;

      const inquiryId = await actor.createInquiry(
        params.name,
        params.email,
        params.phone,
        serviceType,
        params.location,
        params.message
      );

      return inquiryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}

