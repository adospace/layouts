class ArticleClassConverter implements layouts.IConverter {

    convert(fromValue: any, context: any): any {
        return (<boolean>fromValue) ? "articleSelected" : "article";
    }

    convertBack(fromValue: any, context: any): any {

        return fromValue;
    }

}