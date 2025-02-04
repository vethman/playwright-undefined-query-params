import { test, expect, request, APIResponse } from "@playwright/test";

test("getRequestExample: response url should have queryparams when only one param is defined", async () => {
  const response = await getRequestExample({ isbn: "123456" });

  expect(response.url()).toBe("https://example.com/api/getText?isbn=123456");
});

test("getRequestPrepareStep: response url should have queryparams when only one param is defined", async () => {
  const response = await getRequestPrepareStep("123456");

  expect(response.url()).toBe("https://example.com/api/getText?isbn=123456");
});

test("getRequestPrepareStep_FIX: response url should have queryparams when only one param is defined", async () => {
  const response = await getRequestPrepareStep_Fix("123456");

  expect(response.url()).toBe("https://example.com/api/getText?isbn=123456");
});

// imagine this function is in a separate file in my architecture
// I would like to be able to do some logic here and pass the params to the getRequestExample function
async function getRequestPrepareStep(
  isbn: string,
  page?: number
): Promise<APIResponse> {
  return await getRequestExample({ isbn, page });
}

// expect here that when params is undefined, the query params should not be added to the url
// works when I directly call the function, but not when I call it the other function
async function getRequestExample(params?: {
  isbn?: string;
  page?: number;
}): Promise<APIResponse> {
  const requestContext = await request.newContext({
    baseURL: "https://example.com/api/getText",
  });

  return await requestContext.get("", { params });
}

async function getRequestPrepareStep_Fix(
  isbn: string,
  page?: number
): Promise<APIResponse> {
  return await getRequestExampleWith_Fix({ isbn, page });
}

async function getRequestExampleWith_Fix(params?: {
  isbn?: string;
  page?: number;
}): Promise<APIResponse> {
  // FIX
  // would be nice if this was under the hood for the get/post/put/patch/delete methods
  if (params) {
    params = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
  }
  // FIX

  const requestContext = await request.newContext({
    baseURL: "https://example.com/api/getText",
  });

  return await requestContext.get("", { params });
}
