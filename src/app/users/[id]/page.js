import ProfilePage from "@components/ProfilePage";

export default async function page({ params }) {
  // ✅ Correct way: await params directly in function signature destructuring
  const { id } = await params;

  return (
    <ProfilePage
      key="user-profile"
      method="get"
      path={`/protected/user-profile/${id}`}
      editable={false}
    />
  );
}