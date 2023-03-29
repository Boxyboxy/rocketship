import Head from 'next/head';
import NavBar from '../../components/navbar';
import Category from '../../components/category';
import Footer from '../../components/footer';

export default function CreateProject() {
  return (
    <div>
      <NavBar />
      <Category />
      <p> Test form</p>
      <Footer />
    </div>
  );
}
