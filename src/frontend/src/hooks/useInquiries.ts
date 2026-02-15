import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Inquiry } from '../backend';

export function useListInquiries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Inquiry[]>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Actor not available');
      }
      return actor.listInquiries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetInquiry(inquiryId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Inquiry>({
    queryKey: ['inquiry', inquiryId?.toString()],
    queryFn: async () => {
      if (!actor || inquiryId === null) {
        throw new Error('Actor or inquiry ID not available');
      }
      return actor.getInquiry(inquiryId);
    },
    enabled: !!actor && !actorFetching && inquiryId !== null,
  });
}

