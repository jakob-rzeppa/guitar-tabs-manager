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

import { Form } from "../../../components/tab/Form";
import { PagedCollection } from "../../../types/collection";
import { Tab } from "../../../types/Tab";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getTab = async (id: string | string[] | undefined) =>
  id ? await fetch<Tab>(`/tabs/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: tab } = {} } = useQuery<FetchResponse<Tab> | undefined>(
    ["tab", id],
    () => getTab(id)
  );

  if (!tab) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{tab && `Edit Tab ${tab["@id"]}`}</title>
        </Head>
      </div>
      <Form tab={tab} />
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
  const paths = await getItemPaths(response, "tabs", "/tabs/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
