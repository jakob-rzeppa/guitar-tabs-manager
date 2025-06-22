import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getTabs,
  getTabsPath,
} from "../../../components/tab/PageList";
import { PagedCollection } from "../../../types/collection";
import { Tab } from "../../../types/Tab";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getTabsPath(page), getTabs(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Tab>>("/tabs");
  const paths = await getCollectionPaths(response, "tabs", "/tabs/page/[page]");

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
