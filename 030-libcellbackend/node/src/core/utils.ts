/**
 *
 * A set of utility functions.
 *
 */
/**
 *
 * Process a template in the form {{{placeholder}}}, filling it from a data
 * dictionary.
 *
 */
export function processTemplate(template: string, data: any): string {

  Object.keys(data).map((d: string) => {

    template = template.replace(`{{{${d}}}}`, data[d]);

  })

  return template;

}
