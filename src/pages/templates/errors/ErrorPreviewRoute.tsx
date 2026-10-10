import React, { useState } from 'react';
import { ErrorPage } from './ErrorPage';
import { ErrorContext, ErrorTypeId, getErrorType, isErrorContext, isErrorType } from './errorTypes';
import { useDocumentTitle } from '../shared/DemoHint';

/** ?type=404&context=page|app — defaults: 404, page. Types that are Full page only ignore context=app. */
const readParams = (): { type: ErrorTypeId; context: ErrorContext } => {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const context = params.get('context');
  const id: ErrorTypeId = isErrorType(type) ? type : '404';
  const wanted: ErrorContext = isErrorContext(context) ? context : 'page';
  return { type: id, context: getErrorType(id).contexts.includes(wanted) ? wanted : 'page' };
};

/** Full-screen demo route: only the error page, no design-system chrome. */
const ErrorPreviewRoute: React.FC = () => {
  const [params] = useState(readParams);
  const type = getErrorType(params.type);
  useDocumentTitle(`${type.status ? `${type.status} · ` : ''}${type.title} · VisionEdge`);
  return (
    <div className="h-screen">
      <ErrorPage type={params.type} context={params.context} autoFocus />
    </div>
  );
};

export default ErrorPreviewRoute;
