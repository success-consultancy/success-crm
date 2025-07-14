// eslint-disable-next-line
import { useRouter } from 'next/navigation';

import React from 'react';
import { usePathname, useSearchParams as useNextSearchParams } from 'next/navigation';

type Config = {
  scroll?: boolean;
};

const useSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useNextSearchParams()!;

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  // appends params to search params
  const appendQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.append(name, value);

      return params.toString();
    },
    [searchParams],
  );

  // appends params to search params removes param if value is null
  const appendQueryStrings = React.useCallback(
    (paramsArray: Array<{ name: string; value: string | null }>) => {
      const params = new URLSearchParams(searchParams);

      paramsArray.forEach(({ name, value }) => {
        if (value) params.append(name, value);
        else params.delete(name);
      });

      return params.toString();
    },
    [searchParams],
  );

  // removes params from search params
  const removeQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      const paramsArray = Array.from(params.entries());
      const filteredParams = paramsArray.filter(([key, val]) => !(key === name && val === value));
      const newParams = new URLSearchParams(filteredParams);
      return newParams.toString();
    },
    [searchParams],
  );

  // removes params from search params
  const removeQueryStrings = React.useCallback(
    (params: { name: string; value: string | null }[]) => {
      const urlParams = new URLSearchParams(searchParams);
      const paramsArray = Array.from(urlParams.entries());
      const filteredParams = paramsArray.filter(
        ([key, val]) => !params.some((param) => param.name === key && [null, val].includes(param.value)),
      );
      const newParams = new URLSearchParams(filteredParams);
      return newParams.toString();
    },
    [searchParams],
  );

  const deleteQueryString = React.useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(name);

      return params.toString();
    },
    [searchParams],
  );

  // append param
  const appendParam = (name: string, value: string) => {
    router.push(pathname + '?' + appendQueryString(name, value));
  };

  // append params remove param if value is null
  const appendParams = (paramsArray: Array<{ name: string; value: string | null }>, config?: Config) => {
    router.push(pathname + '?' + appendQueryStrings(paramsArray), { scroll: config?.scroll || false });
  };

  // remove param
  const removeParam = (name: string, value: string) => {
    router.push(pathname + '?' + removeQueryString(name, value));
  };

  // remove params
  const removeParams = (paramsArray: Array<{ name: string; value: string | null }>, config?: Config) => {
    router.push(pathname + '?' + removeQueryStrings(paramsArray), { scroll: config?.scroll || false });
  };

  // setParams
  const setParam = (name: string, value: string, config?: Config) => {
    router.push(pathname + '?' + createQueryString(name, value), {
      scroll: config?.scroll || false,
    });
  };

  // delete Params
  const deleteParam = (name: string) => {
    router.push(pathname + '?' + deleteQueryString(name));
  };

  const clearParams = (names: string[]) => {
    const params = new URLSearchParams(searchParams);

    // Remove each specified parameter from the URLSearchParams object
    names.forEach((name) => {
      params.delete(name);
    });

    // Construct the new query string
    const queryString = params.toString();

    // Update the router with the new pathname and query string
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  // get search params from array of params;
  const getSearchParamsArray = (params: Array<string>) => {
    return params.map((_param) => searchParams.get(_param));
  };

  // returns an object containing key-value pairs of search params in array
  const getAllSearchParamsObject = <T extends string>(params: Array<T>) => {
    // type of key-value pairs
    type SearchParamsType = Record<T, string | Array<string>>;
    // 1. Create an empty object to store key-value pairs
    const searchParamsObject: SearchParamsType = {} as SearchParamsType;

    // 2. Iterate through each parameter
    params.forEach((param) => {
      // 3. Retrieve the value using searchParams.get(param)
      const value = searchParams.getAll(param);

      // 4. Check if value exists and add it to the object (skip empty values)
      if (value.length) {
        searchParamsObject[param] = value;
      }
    });

    return searchParamsObject;
  };

  // returns an object containing key-value pairs of search params
  const getSearchParamsObject = <T extends string>(params: Array<T>) => {
    // type of key-value pairs
    type SearchParamsType = Record<T, string>;
    // 1. Create an empty object to store key-value pairs
    const searchParamsObject: SearchParamsType = {} as SearchParamsType;

    // 2. Iterate through each parameter
    params.forEach((param) => {
      // 3. Retrieve the value using searchParams.get(param)
      const value = searchParams.get(param);

      // 4. Check if value exists and add it to the object (skip empty values)
      if (value) {
        searchParamsObject[param] = value;
      }
    });

    return searchParamsObject;
  };

  // create query string from array of params
  const createQueryStringFromArrayOfParams = React.useCallback(
    (params: Array<{ name: string; value: string | null }>) => {
      const _urlParams = new URLSearchParams(searchParams);
      params.forEach(({ name, value }) => {
        if (!value) {
          _urlParams.delete(name);
        } else _urlParams.set(name, value);
      });

      return _urlParams.toString();
    },
    [searchParams],
  );

  const setParams = (paramsArray: Array<{ name: string; value: string | null }>, config?: Config) => {
    router.push(pathname + '?' + createQueryStringFromArrayOfParams(paramsArray), {
      scroll: config?.scroll || false,
    });
  };

  return {
    setParam,
    setParams,
    appendParam,
    removeParam,
    deleteParam,
    clearParams,
    appendParams,
    searchParams,
    removeParams,
    getSearchParamsObject,
    getSearchParamsArray,
    getAllSearchParamsObject,
  };
};

export default useSearchParams;
