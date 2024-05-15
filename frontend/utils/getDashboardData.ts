export async function getDashboardData(userid: string | null) {
  const url = `http://localhost:5000/user/dashboard?userid=${userid}`;
  const response = await fetch(url, {
    cache: "no-cache",
    method: "GET",
    credentials: "include",
  });
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else if (response.status === 401) {
    console.log("Apps not found");
    return 401;
  } else if (response.status === 500) {
    console.log("Internal error");
    return 500;
  }
}
