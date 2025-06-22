import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/tab/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Tab</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
