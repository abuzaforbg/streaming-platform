import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ProfileCode } from "../../../layout/profile/ProfileCode/ProfileCode";
import { useRouter } from "next/router";
import { validateProfileCode } from "@lib/api/profile";
import { GetStaticProps } from "next";
import { MOCK_PROFILES } from "@lib/mock/profile";
import { text } from "@css/typography";
import { Close, CloseButton } from "../index";
import { Spinner } from "../../../layout/shared/Spinner";

const CodeWrapper = styled.div`
    position: relative;
    padding: 10rem 0;
    overflow-y: auto;
    text-align: center;

    ${p => p.theme.breakpoints.min("m")} {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }

    ${p => p.theme.breakpoints.min("l")} {
        display: flex;
        align-items: center;
    }
`;

const CodeHelpWrapper = styled.div`
    min-height: 2.5rem;
    margin-top: 4rem;
`;

const CodeHelp = styled.div`
    ${text("textXl", "bold")};
    color: ${p => p.theme.gray400};
`;

const CodeLoading = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const Code: React.FC = () => {
    const router = useRouter();
    const { uid } = router.query;
    const [loading, setLoading] = useState<boolean>(false);
    const [code, setCode] = useState<string>("");
    const [error, setError] = useState<Common.Error | null>(null);

    useEffect(() => {
        if (code.length === 4) {
            submitCode();
        }
    }, [code, uid]);

    const submitCode = async () => {
        if (!uid || typeof uid !== "string") {
            return;
        }

        setLoading(true);

        const res = await validateProfileCode(uid, code);

        if (!res) {
            return router.replace("/profile");
        }

        switch (res.status) {
            case 400:
                setLoading(false);
                return setError(res);
            case 500:
                return router.replace("/profile");
            default:
                return (location.href = "/");
        }
    };

    return loading ? (
        <CodeLoading>
            <Spinner />
        </CodeLoading>
    ) : (
        <CodeWrapper>
            <CloseButton href="/" passHref>
                <Close />
            </CloseButton>
            <ProfileCode error={error} onChange={setCode} />
            <CodeHelpWrapper>
                {uid && typeof uid === "string" && MOCK_PROFILES[uid] && (
                    <CodeHelp>Psst, it&apos;s {MOCK_PROFILES[uid].password}.</CodeHelp>
                )}
            </CodeHelpWrapper>
        </CodeWrapper>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            hideNavigation: true,
        },
    };
};

export default Code;
