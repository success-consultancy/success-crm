// eslint-disable-next-line
import { useRouter, usePathname } from 'next/navigation';

import useSearchParams from './use-search-params';

export const PAGE_PARAM = 'page';
export const SORT_PARAM = 'sort';
export const LIMIT_PARAM = 'limit';
export const SEARCH_PARAM = 'q';

interface PaginationParms {
  q?: string;
  page?: number | string;
  sort?: string;
  limit?: number | string;
}

type PaginationParamsKeys = keyof PaginationParms;
const PAGINATION_PARAMS: Array<PaginationParamsKeys> = [PAGE_PARAM, SORT_PARAM, LIMIT_PARAM, SEARCH_PARAM];

/**
 * This hook provides functionality for managing pagination and search parameters within a URL-driven interface. It leverages custom hooks for search parameter manipulation and debouncing.
 *
 * Key Features:
 * - Retrieves current page, sort order, and search term from URL search parameters.
 * - Provides debouncing  for the search query to improve performance.
 * - Includes functions to update the page, search query, and sort order, automatically reflecting changes in the URL.
 * - Resets the page to 1 when either the search query or sort order is changed.
 */

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const usePagination = (defaultParams?: Partial<PaginationParms>) => {
  const router = useRouter();
  const pathname = usePathname();

  const { setParam, searchParams, deleteParam, getSearchParamsArray } = useSearchParams();

  const defaultPage = defaultParams?.page ? parseInt(`${defaultParams?.page}`) : DEFAULT_PAGE;
  const defaultLimit = defaultParams?.limit ? parseInt(`${defaultParams?.limit}`) : DEFAULT_LIMIT;

  const pageValue = searchParams.get(PAGE_PARAM);
  const limitValue = searchParams.get(LIMIT_PARAM);
  const page: number = pageValue ? parseInt(pageValue) : defaultPage;
  const limit = limitValue ? parseInt(limitValue) : defaultLimit;

  const [sort, q] = getSearchParamsArray([SORT_PARAM, SEARCH_PARAM]);

  //   sets the search query string
  const setSearchQuery = (search: string) => {
    if (!search?.trim()) {
      URLParams.delete(SEARCH_PARAM);
    } else {
      URLParams.set(SEARCH_PARAM, search);
    }
    URLParams.delete(PAGE_PARAM);
    router.push(pathname + '?' + URLParams.toString());
  };

  //   sets the page value
  const setPage = (newPage: number) => setParam(PAGE_PARAM, newPage.toString());

  // next page
  const goToNextPage = () => {
    setPage(page + 1);
  };

  //  prev page
  const gotToPrevPage = () => {
    setPage(page - 1);
  };

  // set limit value
  const setLimit = (newLimit: number) => setParam(LIMIT_PARAM, newLimit?.toString());

  const URLParams = new URLSearchParams(searchParams);

  //   sets the sort order
  const setSort = (newSort: string) => {
    URLParams.delete(PAGE_PARAM);
    URLParams.set(SORT_PARAM, newSort);
  };

  /** info: This function is used to remove page param from URL search params
   * use case : when filters or search are changed
   */
  const removePageParam = () => {
    deleteParam(PAGE_PARAM);
  };

  //  pagination params
  // It inclues page, sort and q i.e. debounced search query
  const paginationParams = {
    page,
    limit,
    sort: (sort as string) || defaultParams?.sort,
    q: q || defaultParams?.q || '',
  };

  return {
    params: paginationParams,
    removePageParam,
    // update functions
    setSort,
    setSearchQuery,
    setPage,
    setLimit,
    deleteParam,
    gotToPrevPage,
    goToNextPage,
  };
};

export type { PaginationParms, PaginationParamsKeys };
export { PAGINATION_PARAMS };
export default usePagination;
