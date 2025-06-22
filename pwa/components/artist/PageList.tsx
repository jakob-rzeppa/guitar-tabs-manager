import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Artist } from "../../types/Artist";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getArtistsPath = (page?: string | string[] | undefined) =>
  `/artists${typeof page === "string" ? `?page=${page}` : ""}`;
export const getArtists = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Artist>>(getArtistsPath(page));
const getPagePath = (path: string) =>
  `/artists/page/${parsePage("artists", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: artists, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Artist>> | undefined
  >(getArtistsPath(page), getArtists(page));
  const collection = useMercure(artists, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Artist List</title>
        </Head>
      </div>
      <List artists={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
