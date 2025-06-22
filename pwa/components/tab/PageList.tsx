import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Tab } from "../../types/Tab";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getTabsPath = (page?: string | string[] | undefined) =>
  `/tabs${typeof page === "string" ? `?page=${page}` : ""}`;
export const getTabs = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Tab>>(getTabsPath(page));
const getPagePath = (path: string) => `/tabs/page/${parsePage("tabs", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: tabs, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Tab>> | undefined
  >(getTabsPath(page), getTabs(page));
  const collection = useMercure(tabs, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Tab List</title>
        </Head>
      </div>
      <List tabs={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
