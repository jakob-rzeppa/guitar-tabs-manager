import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Tab } from "../../types/Tab";

interface Props {
  tab?: Tab;
}

interface SaveParams {
  values: Tab;
}

interface DeleteParams {
  id: string;
}

const saveTab = async ({ values }: SaveParams) =>
  await fetch<Tab>(!values["@id"] ? "/tabs" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteTab = async (id: string) =>
  await fetch<Tab>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ tab }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Tab> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveTab(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Tab> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteTab(id), {
    onSuccess: () => {
      router.push("/tabs");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!tab || !tab["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: tab["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/tabs"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {tab ? `Edit Tab ${tab["@id"]}` : `Create Tab`}
      </h1>
      <Formik
        initialValues={
          tab
            ? {
                ...tab,
              }
            : new Tab()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/tabs");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="tab_title"
              >
                title
              </label>
              <input
                name="title"
                id="tab_title"
                value={values.title ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.title && touched.title ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.title && touched.title ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="title"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="tab_capo"
              >
                capo
              </label>
              <input
                name="capo"
                id="tab_capo"
                value={values.capo ?? ""}
                type="number"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.capo && touched.capo ? "border-red-500" : ""
                }`}
                aria-invalid={errors.capo && touched.capo ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="capo"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="tab_content"
              >
                content
              </label>
              <input
                name="content"
                id="tab_content"
                value={values.content ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.content && touched.content ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.content && touched.content ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="content"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">tags</div>
              <FieldArray
                name="tags"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="tab_tags">
                    {values.tags && values.tags.length > 0 ? (
                      values.tags.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`tags.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="tab_artist"
              >
                artist
              </label>
              <input
                name="artist"
                id="tab_artist"
                value={values.artist ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.artist && touched.artist ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.artist && touched.artist ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="artist"
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {tab && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
