import Head from 'next/head';
import NavBar from '../../components/navbar';
import Category from '../../components/category';
import Footer from '../../components/footer';
import { categorydata } from '../../constants/categorydata';
import CategoryPage from '../../components/categoryPage';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  const { categoryname } = context.query;
  // Get the list of possible categories
  const categories = [
    'fintech',
    'healthtech',
    'fnb',
    'socialmedia',
    'games',
    'agritech',
    'edutech',
    'ecommerce'
  ];
  // Get the content for the specified category
  const content = categorydata[categoryname];
  // Check if the requested category is valid
  if (!categories.includes(categoryname)) {
    return {
      notFound: true
    };
  }
  return {
    props: {
      // categoryname,
      content
    }
  };
}

export default function DynamicCategoryPage() {
  const router = useRouter();
  const { categoryname } = router.query;
  const selectedCategory = {
    id: 1, // replace with actual category id based on the category name
    name: categoryname
  };
  return (
    <div>
      <Head>
        <title>Discover {categoryname} projects</title>
      </Head>
      <NavBar />
      <Category />
      <CategoryPage selectedCategory={selectedCategory} />
      <Footer />
    </div>
  );
}
