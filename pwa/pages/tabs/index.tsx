import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import { PageList, getTabs, getTabsPath } from "../../components/tab/PageList";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getTabsPath(), getTabs());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default PageList;
