import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useAdminGuard() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;

  const adminQuery = useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Actor not available');
      }
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  return {
    isLoading: isInitializing || actorFetching || (isAuthenticated && adminQuery.isLoading),
    isAuthenticated,
    isAdmin: adminQuery.data === true,
    error: adminQuery.error,
  };
}

