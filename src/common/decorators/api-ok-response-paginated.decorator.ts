import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiOkResponsePaginated<TModel extends Type<unknown>>(
  model: TModel,
) {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          meta: {
            type: 'object',
            properties: {
              totalItems: { type: 'number', example: 1 },
              totalPages: { type: 'number', example: 1 },
              currentPage: { type: 'number', example: 1 },
              itemsPerPage: { type: 'number', example: 1 },
            },
          },
        },
      },
    }),
  );
}
