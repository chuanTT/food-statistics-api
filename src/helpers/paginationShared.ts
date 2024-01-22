type pageAndLimit = {
  page?: number;
  limit?: number;
};

type paginationSharedParams<T> = pageAndLimit & {
  serviceCallBack: (obj: pageAndLimit) => Promise<[T[], number]>;
};

const paginationShared = <T>({ page, limit }: paginationSharedParams<T>) => {};
