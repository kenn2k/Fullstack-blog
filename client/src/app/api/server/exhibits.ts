import { cookies } from "next/headers";

export const getMyExhibits = async (page: number) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return [];
  }

  const response = await fetch(
    `${process.env.BASE_URL}/api/exhibits/my-posts?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
};
