import { GetServerSidePropsContext } from "next";

export default function HomePage() {
  return (
    <div>

    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: "/auth",
      permanent: true,
    }
  }
}