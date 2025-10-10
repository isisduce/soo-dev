export const UrlHelper = {
    ResolveUrl: (urlString: string | undefined, hostname: string | undefined): string | undefined => {
        if (urlString && urlString.startsWith('http') && hostname) {
            let url = new URL(urlString);
            url.hostname = hostname;
            urlString = url.toString().replace(/\/$/, '');
        }
        return urlString;
    }
};
