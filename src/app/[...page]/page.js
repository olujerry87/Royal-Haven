import { builder } from "@builder.io/react";
import { RenderBuilderContent } from "@/components/builder";

// Builder API Key - already initialized in layout, but good practice to have here too
builder.init("25e5eaee7d1c42fb84ae738159147ca4");

export default async function Page(props) {
    const model = "page";
    const content = await builder
        .get(model, {
            userAttributes: {
                urlPath: "/" + (props.params?.page?.join("/") || ""),
            },
        })
        .toPromise();

    return (
        <>
            <RenderBuilderContent content={content} model={model} />
        </>
    );
}
