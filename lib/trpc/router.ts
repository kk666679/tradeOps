/**
 * Auto-generated frontend-facing tRPC router type.
 *
 * Re-exported from the compiled Nest backend (`backend/src/trpc/trpc.router.ts`)
 * so the Next.js app gets end-to-end types for every procedure without a
 * duplicate router definition. Regenerate with: `npm run trpc:types`.
 */
export type AppRouter = import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        auth: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            me: import("@trpc/server").TRPCQueryProcedure<{
                input: void;
                output: {
                    id: string;
                    email: string;
                    role: string;
                    tenantId: string;
                } | null;
                meta: object;
            }>;
            login: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    email: string;
                    password: string;
                };
                output: {
                    ok: boolean;
                    access: string;
                };
                meta: object;
            }>;
            register: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    name: string;
                    email: string;
                    password: string;
                    passwordConfirmation: string;
                };
                output: {
                    ok: boolean;
                    access: string;
                    userId: string;
                };
                meta: object;
            }>;
            refresh: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    refresh: string;
                };
                output: void;
                meta: object;
            }>;
        }>>;
        user: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: void;
                output: {
                    tenantId: string;
                    email: string;
                    password: string;
                    name: string | null;
                    id: string;
                    emailVerified: Date | null;
                    avatarUrl: string | null;
                    phone: string | null;
                    locale: string;
                    timezone: string;
                    role: import(".prisma/client").$Enums.GlobalRole;
                    status: import(".prisma/client").$Enums.UserStatus;
                    mfaEnabled: boolean;
                    mfaSecret: string | null;
                    lastLoginAt: Date | null;
                    lastLoginIp: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                }[];
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    email: string;
                    role?: "SUPER_ADMIN" | "ADMIN" | "OPS_MANAGER" | "WAREHOUSE_STAFF" | "CUSTOMER" | "AGENT" | "AUDITOR" | undefined;
                };
                output: {
                    tenantId: string;
                    email: string;
                    password: string;
                    name: string | null;
                    id: string;
                    emailVerified: Date | null;
                    avatarUrl: string | null;
                    phone: string | null;
                    locale: string;
                    timezone: string;
                    role: import(".prisma/client").$Enums.GlobalRole;
                    status: import(".prisma/client").$Enums.UserStatus;
                    mfaEnabled: boolean;
                    mfaSecret: string | null;
                    lastLoginAt: Date | null;
                    lastLoginIp: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                    role?: "SUPER_ADMIN" | "ADMIN" | "OPS_MANAGER" | "WAREHOUSE_STAFF" | "CUSTOMER" | "AGENT" | "AUDITOR" | undefined;
                    name?: string | undefined;
                };
                output: import(".prisma/client").Prisma.BatchPayload;
                meta: object;
            }>;
            remove: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: import(".prisma/client").Prisma.BatchPayload;
                meta: object;
            }>;
        }>>;
        tenant: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    take?: number | undefined;
                    cursor?: string | undefined;
                } | undefined;
                output: any;
                meta: object;
            }>;
            byId: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: any;
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    [x: string]: unknown;
                };
                output: any;
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    [x: string]: unknown;
                    id: string;
                };
                output: any;
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: any;
                meta: object;
            }>;
        }>>;
        dashboard: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            getMetrics: import("@trpc/server").TRPCQueryProcedure<{
                input: void;
                output: {
                    inventoryCount: number;
                    cargoCount: number;
                    activeOutboundCount: number;
                    warningCount: number;
                };
                meta: object;
            }>;
        }> & import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    take?: number | undefined;
                    cursor?: string | undefined;
                } | undefined;
                output: any;
                meta: object;
            }>;
            byId: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: any;
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    [x: string]: unknown;
                };
                output: any;
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    [x: string]: unknown;
                    id: string;
                };
                output: any;
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: any;
                meta: object;
            }>;
        }>>;
        task: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    take?: number | undefined;
                    cursor?: string | undefined;
                } | undefined;
                output: any;
                meta: object;
            }>;
            byId: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: any;
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    [x: string]: unknown;
                };
                output: any;
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    [x: string]: unknown;
                    id: string;
                };
                output: any;
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: any;
                meta: object;
            }>;
        }>>;
        inventory: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    take?: number | undefined;
                    cursor?: string | undefined;
                } | undefined;
                output: any;
                meta: object;
            }>;
            byId: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: any;
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    [x: string]: unknown;
                };
                output: any;
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    [x: string]: unknown;
                    id: string;
                };
                output: any;
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: any;
                meta: object;
            }>;
        }>>;
        logistics: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    take?: number | undefined;
                    cursor?: string | undefined;
                } | undefined;
                output: any;
                meta: object;
            }>;
            byId: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: any;
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    [x: string]: unknown;
                };
                output: any;
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    [x: string]: unknown;
                    id: string;
                };
                output: any;
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: any;
                meta: object;
            }>;
        }>>;
        digitalTwin: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    take?: number | undefined;
                    cursor?: string | undefined;
                } | undefined;
                output: any;
                meta: object;
            }>;
            byId: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: any;
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    [x: string]: unknown;
                };
                output: any;
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    [x: string]: unknown;
                    id: string;
                };
                output: any;
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: any;
                meta: object;
            }>;
        }>>;
        cargo: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            main: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            bulk: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            fcz: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            fiz: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            hazmat: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
        }>>;
        wms: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            bonded: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            exemption: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            forecasting: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            gate: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            inbound: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            inventory: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            movement: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            outbound: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            slotting: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
        }>>;
        tradeOps: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            analytics: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                getMetrics: import("@trpc/server").TRPCQueryProcedure<{
                    input: void;
                    output: {
                        declarations: any;
                        clearance: any;
                        openFindings: any;
                        permits: any;
                        documents: any;
                        dutyCalculations: any;
                        byStatus: Record<string, number>;
                    };
                    meta: object;
                }>;
            }>>;
            clearance: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            compliance: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            declarations: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            documents: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            duty: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        declarationId?: string | undefined;
                        take?: number | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        declarationId: string;
                        method: string;
                        assessableValue: number;
                        currency?: string | undefined;
                        duty?: number | undefined;
                        salesTax?: number | undefined;
                        excise?: number | undefined;
                        total?: number | undefined;
                        breakdown?: any;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            hsClassification: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            hsCodeRulings: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            permits: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            tradeFinance: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
        }>>;
        orderManagement: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            approvals: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            customs: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            fulfilment: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            manufacturing: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            purchase: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            trading: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            transhipment: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
        }>>;
        customAgents: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            audit: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            builder: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            customsAgents: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            evals: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            memory: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            monitoring: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            orchestration: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                listWorkflows: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        q?: string | undefined;
                        take?: number | undefined;
                    } | undefined;
                    output: {
                        id: string;
                        name: string;
                        description: any;
                        updatedAt: string;
                        active: boolean;
                    }[];
                    meta: object;
                }>;
                getWorkflow: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        workflowId: string;
                    };
                    output: {
                        id: string;
                        name: string;
                        description: any;
                        definition: any;
                        updatedAt: string;
                    };
                    meta: object;
                }>;
                saveDraft: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        name: string;
                        definition: {
                            [x: string]: unknown;
                            nodes: any[];
                            edges: any[];
                            schemaVersion?: number | undefined;
                            trigger?: {
                                type: "manual";
                            } | undefined;
                            viewport?: {
                                x: number;
                                y: number;
                                zoom: number;
                            } | undefined;
                        };
                        workflowId?: string | undefined;
                        expectedUpdatedAt?: string | undefined;
                        description?: string | undefined;
                    };
                    output: {
                        id: string;
                        name: string;
                        description: string;
                        updatedAt: string;
                    };
                    meta: object;
                }>;
                validate: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        definition: {
                            [x: string]: unknown;
                            nodes: any[];
                            edges: any[];
                            schemaVersion?: number | undefined;
                            trigger?: {
                                type: "manual";
                            } | undefined;
                            viewport?: {
                                x: number;
                                y: number;
                                zoom: number;
                            } | undefined;
                        };
                    };
                    output: {
                        issues: {
                            code: string;
                            message: string;
                            nodeId?: string;
                            edgeId?: string;
                        }[];
                    };
                    meta: object;
                }>;
                execute: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        workflowId: string;
                        input?: Record<string, unknown> | undefined;
                    };
                    output: {
                        id: string;
                        workflowId: string;
                        status: import(".prisma/client").$Enums.WorkflowRunStatus;
                        output: unknown;
                        steps: {
                            nodeId: string;
                            status: "SUCCEEDED" | "FAILED" | "SKIPPED";
                            attempts: number;
                            startedAt?: string;
                            endedAt: string;
                            input?: unknown;
                            output?: unknown;
                            error?: string;
                            logs: {
                                level: "info" | "error";
                                message: string;
                            }[];
                        }[];
                        startedAt: string;
                        endedAt: string | null;
                        error?: undefined;
                    } | {
                        id: string;
                        workflowId: string;
                        status: import(".prisma/client").$Enums.WorkflowRunStatus;
                        output: null;
                        steps: import(".prisma/client/runtime/client").JsonValue;
                        error: string;
                        startedAt: string;
                        endedAt: string | null;
                    };
                    meta: object;
                }>;
                listRuns: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        workflowId: string;
                        take?: number | undefined;
                    };
                    output: {
                        id: string;
                        status: import(".prisma/client").$Enums.WorkflowRunStatus;
                        input: import(".prisma/client/runtime/client").JsonValue;
                        output: import(".prisma/client/runtime/client").JsonValue;
                        error: string | null;
                        steps: import(".prisma/client/runtime/client").JsonValue;
                        startedAt: string;
                        endedAt: string | null;
                    }[];
                    meta: object;
                }>;
                getRun: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        runId: string;
                    };
                    output: {
                        id: string;
                        workflowId: string;
                        workflowName: string;
                        status: import(".prisma/client").$Enums.WorkflowRunStatus;
                        input: import(".prisma/client/runtime/client").JsonValue;
                        output: import(".prisma/client/runtime/client").JsonValue;
                        error: string | null;
                        steps: import(".prisma/client/runtime/client").JsonValue;
                        definition: any;
                        startedAt: string;
                        endedAt: string | null;
                    };
                    meta: object;
                }>;
            }>>;
            policy: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            registry: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            supervision: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
        }>>;
        fiz: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            machinery: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            operators: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            production: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            subcontract: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            wastage: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
        }>>;
        fcz: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            breakBulk: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            entrepot: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            reexport: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            tradingHouses: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            transhipment: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
        }>>;
        integration: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
            meta: object;
            errorShape: import("@trpc/server").TRPCDefaultErrorShape;
            transformer: true;
        }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
            agentMesh: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            customs: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            edi: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            erp: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            fizFcz: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            tms: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            webhook: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            wmsExt: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                list: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        cursor?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                byId: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                create: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                    };
                    output: any;
                    meta: object;
                }>;
                update: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        [x: string]: unknown;
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
                delete: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        id: string;
                    };
                    output: any;
                    meta: object;
                }>;
            }>>;
            jkdm: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("../../backend/src/trpc/trpc.context").TrpcCtx;
                meta: object;
                errorShape: import("@trpc/server").TRPCDefaultErrorShape;
                transformer: true;
            }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
                capabilities: import("@trpc/server").TRPCQueryProcedure<{
                    input: void;
                    output: import("../integration/jkdm/jkdm.service").JkdmCapabilitySnapshot;
                    meta: object;
                }>;
                submitDeclaration: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        idempotencyKey: string;
                        submission: {
                            draftRef: string;
                            idempotencyKey: string;
                            tenantId: string;
                            brokerCode: string;
                            formCode: "K1" | "K2" | "K3" | "K7" | "K8" | "K9";
                            procedureCode: string;
                            portOfEntry: string;
                            importerName: string;
                            importerRegistration: string;
                            exporterName: string;
                            exporterCountry: string;
                            blNumber: string;
                            invoiceNumber: string;
                            invoiceDate: string;
                            currency: string;
                            totalFOB: number;
                            totalFreight: number;
                            totalInsurance: number;
                            totalCIFMYR: number;
                            lineItems: {
                                lineNumber: number;
                                hsCode: string;
                                description: string;
                                quantity: number;
                                uom: string;
                                unitValueMYR: number;
                                countryOfOrigin: string;
                                preferenceScheme?: "ATIGA" | "ACFTA" | "RCEP" | "CPTPP" | "MJEPA" | "MCFTA" | "MFN" | undefined;
                                permitRefs?: string[] | undefined;
                            }[];
                        };
                        declarationId?: string | undefined;
                    };
                    output: {
                        provenance: import("../integration/jkdm").Provenance;
                        synthetic: boolean;
                        acknowledged: boolean;
                        externalRef?: string;
                        channel?: import("../integration/jkdm").CustomsChannel;
                        submittedAt: string;
                        correlationId: string;
                        errors?: Array<{
                            code: string;
                            message: string;
                            field?: string;
                        }>;
                        operationId: string;
                        duplicate: boolean;
                    };
                    meta: object;
                }>;
                queryDeclarationStatus: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        declarationRef: string;
                    };
                    output: import("../integration/jkdm").DeclarationStatus;
                    meta: object;
                }>;
                recordManualResponse: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        draftRef: string;
                        idempotencyKey: string;
                        tenantId: string;
                        recordedBy: string;
                        outcome: "query" | "inspection" | "released" | "rejected" | "amended";
                        observedAt: string;
                        externalRef?: string | undefined;
                        exceptionReason?: string | undefined;
                        officerName?: string | undefined;
                        officerId?: string | undefined;
                        notes?: string | undefined;
                        evidenceRef?: string | undefined;
                        additionalEvidenceRefs?: string[] | undefined;
                        declarationId?: string | undefined;
                    };
                    output: import("../integration/jkdm").ManualResponseRecord;
                    meta: object;
                }>;
                reviewManualResponse: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        recordId: string;
                        decision: "rejected" | "reviewed";
                    };
                    output: {
                        id: string;
                        reviewStatus: string;
                    };
                    meta: object;
                }>;
                listOperations: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        declarationId?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
                listManualResponses: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        take?: number | undefined;
                        declarationId?: string | undefined;
                    } | undefined;
                    output: any;
                    meta: object;
                }>;
            }>>;
        }>>;
    }>>;
