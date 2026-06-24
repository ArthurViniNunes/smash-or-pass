"use client";

import { useRouter } from "next/navigation";
import HeaderSection from "@/components/account/HeaderSection";
import SelectionGrid from "@/components/account/SelectionGrid";
import AccountCard from "@/components/account/AccountCard";
import { UserIcon, AdminIcon } from "@/components/account/AccountIcons";
import type { AccountType, AccountOption } from "@/types/account";
import styles from "./select-account.module.css";
import { useEffect } from "react";
import { authService } from "@/services/auth.service";

const ACCOUNT_OPTIONS: AccountOption[] = [
    {
        type: "user",
        title: "Usuário",
        description: "Descubra seu próximo match culinário",
        href: "/swipe",
    },
    {
        type: "admin",
        title: "Admin",
        description: "Gerencia receitas e avalia dashboards",
        href: "/admin",
    },
];

const ACCOUNT_ICONS: Record<AccountType, React.ReactNode> = {
    user: <UserIcon />,
    admin: <AdminIcon />,
};

export default function AccountSelectionPage() {
    const router = useRouter();

    useEffect(() => {
    authService
        .me()
        .then((user) => {
        if (user.role !== "ADMIN") router.replace("/swipe");
        })
        .catch(() => router.replace("/login"));
    }, [router]);

    return (
        <main className={styles.page}>
        <HeaderSection title="Selecione o tipo de" highlight="conta:" />

        <SelectionGrid>
            {ACCOUNT_OPTIONS.map((option) => (
            <AccountCard
                key={option.type}
                title={option.title}
                description={option.description}
                icon={ACCOUNT_ICONS[option.type]}
                onClick={() => router.push(option.href)}
            />
            ))}
        </SelectionGrid>
        </main>
    );
    }