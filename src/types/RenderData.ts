import RouteMetaData from './RouteMetaData';
type RenderData = RouteMetaData & {
  params?: Map<String, String>;
  query?: URLSearchParams;
}

export default RenderData;
