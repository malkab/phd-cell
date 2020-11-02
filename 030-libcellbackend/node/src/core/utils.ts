/**
 *
 * A set of utility functions.
 *
 */
export function processTemplate(template: string, data: any): string {

  Object.keys(data).map((d: string) => {

    template = template.replace(`{{{${d}}}}`, data[d]);

  })

  return template;

}
