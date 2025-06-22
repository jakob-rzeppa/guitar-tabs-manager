import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/artist/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Artist</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
