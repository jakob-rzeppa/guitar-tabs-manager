import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/tab/Show";
import { PagedCollection } from "../../../types/collection";
import { Tab } from "../../../types/Tab";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getTab = async (id: string | string[] | undefined) =>
  id ? await fetch<Tab>(`/tabs/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: tab, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Tab> | undefined>(["tab", id], () => getTab(id));
  const tabData = useMercure(tab, hubURL);

  if (!tabData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Tab ${tabData["@id"]}`}</title>
        </Head>
      </div>
      <Show tab={tabData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["tab", id], () => getTab(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Tab>>("/tabs");
  const paths = await getItemPaths(response, "tabs", "/tabs/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
