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

import { Show } from "../../../components/artist/Show";
import { PagedCollection } from "../../../types/collection";
import { Artist } from "../../../types/Artist";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getArtist = async (id: string | string[] | undefined) =>
  id ? await fetch<Artist>(`/artists/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: artist, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Artist> | undefined>(["artist", id], () =>
      getArtist(id)
    );
  const artistData = useMercure(artist, hubURL);

  if (!artistData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Artist ${artistData["@id"]}`}</title>
        </Head>
      </div>
      <Show artist={artistData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["artist", id], () => getArtist(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Artist>>("/artists");
  const paths = await getItemPaths(response, "artists", "/artists/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
