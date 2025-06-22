import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getArtists,
  getArtistsPath,
} from "../../../components/artist/PageList";
import { PagedCollection } from "../../../types/collection";
import { Artist } from "../../../types/Artist";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getArtistsPath(page), getArtists(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Artist>>("/artists");
  const paths = await getCollectionPaths(
    response,
    "artists",
    "/artists/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
