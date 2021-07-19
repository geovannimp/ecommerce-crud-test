import { GetStaticProps, InferGetStaticPropsType } from 'next';

import { createSwaggerSpec } from 'next-swagger-doc';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDoc = ({ spec }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <SwaggerUI spec={spec} />;
};

export const getStaticProps: GetStaticProps = async ctx => {
  const spec: Record<string, any> = createSwaggerSpec({
    openApiVersion: '3.0.1',
    title: 'Ecommerce Crud Swagger',
    version: '0.1.0',
    apiFolder: 'src/pages/api',
  });
  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
