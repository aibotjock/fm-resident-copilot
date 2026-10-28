declare module "pdf-parse/lib/pdf-parse.js" {
  const parse:(data:Buffer,options?:{max?:number})=>Promise<{text:string;info?:{Title?:string}}>;
  export default parse;
}
