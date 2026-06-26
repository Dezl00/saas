"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addCustomDomain(formData: FormData) {
  const session = await auth();
  if (!session?.user?.storeId) return { error: "??? ???? ??" };

  let domainName = formData.get("domain") as string;
  if (!domainName) return { error: "???? ????? ???????" };

  domainName = domainName.replace(/^(https?:\/\/)?/, '').replace(/\/$/, '').toLowerCase();
  const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domainName)) return { error: "???? ??????? ??? ?????" };

  try {
    const existing = await prisma.domain.findUnique({ where: { name: domainName } });
    if (existing) return { error: "?????? ??? ??????? ????? ????? ???." };

    const token = process.env.VERCEL_ACCESS_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;

    let dnsRecords: any = { cname: "cname.vercel-dns.com", a: "76.76.21.21" };

    if (token && projectId) {
      const res = await fetch(https://api.vercel.com/v10/projects//domains, {
        method: 'POST',
        headers: { "Authorization": Bearer , "Content-Type": "application/json" },
        body: JSON.stringify({ name: domainName })
      });
      
      if (!res.ok) {
        const data = await res.json();
        return { error: data.error?.message || "??? ?? Vercel" };
      }

      if (domainName.split('.').length === 2) {
        await fetch(https://api.vercel.com/v10/projects//domains, {
          method: 'POST',
          headers: { "Authorization": Bearer , "Content-Type": "application/json" },
          body: JSON.stringify({ name: www. })
        }).catch(() => {});
      }
      
      const configRes = await fetch(https://api.vercel.com/v6/domains//config, {
        headers: { "Authorization": Bearer  }
      });
      const configData = await configRes.json();
      
      const projectDomainRes = await fetch(https://api.vercel.com/v9/projects//domains/, {
        headers: { "Authorization": Bearer  }
      });
      const projectDomainData = await projectDomainRes.json();

      if (configData.misconfigured) {
        dnsRecords = {
          intendedNameservers: projectDomainData.intendedNameservers || ["ns1.vercel-dns.com", "ns2.vercel-dns.com"],
          cname: "cname.vercel-dns.com",
          a: "76.76.21.21"
        };
      }
    }

    await prisma.domain.create({
      data: {
        name: domainName,
        storeId: session.user.storeId,
        status: "WAITING_DNS",
        dnsRecords
      }
    });

    revalidatePath("/dashboard/settings");
    return { success: "??? ????? ??????? ?????." };

  } catch (error) {
    console.error(error);
    return { error: "??? ??? ?????." };
  }
}

export async function verifyDomainStatus(domainId: string) {
  const session = await auth();
  if (!session?.user?.storeId) return { error: "??? ???? ??" };

  try {
    const domain = await prisma.domain.findUnique({ where: { id: domainId } });
    if (!domain || domain.storeId !== session.user.storeId) return { error: "??????? ??? ?????" };

    const token = process.env.VERCEL_ACCESS_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    if (!token || !projectId) return { error: "??????? Vercel ??????" };

    const configRes = await fetch(https://api.vercel.com/v6/domains//config, {
      headers: { "Authorization": Bearer  }
    });
    const configData = await configRes.json();

    if (!configData.misconfigured) {
      await prisma.domain.update({
        where: { id: domain.id },
        data: { status: "CONNECTED" }
      });
      revalidatePath("/dashboard/settings");
      return { success: "?? ?????? ?????!", status: "CONNECTED" };
    } else {
      return { error: "??????? DNS ??? ????? ???." };
    }
  } catch (error) {
    return { error: "??? ??????." };
  }
}

export async function removeCustomDomain(domainId: string) {
  const session = await auth();
  if (!session?.user?.storeId) return { error: "??? ???? ??" };

  try {
    const domain = await prisma.domain.findUnique({ where: { id: domainId } });
    if (!domain || domain.storeId !== session.user.storeId) return { error: "??????? ??? ?????" };

    const token = process.env.VERCEL_ACCESS_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;

    if (token && projectId) {
      await fetch(https://api.vercel.com/v9/projects//domains/, {
        method: 'DELETE',
        headers: { "Authorization": Bearer  }
      }).catch(() => {});
    }

    await prisma.domain.delete({ where: { id: domainId } });
    revalidatePath("/dashboard/settings");
    return { success: "?? ????? ?????." };
  } catch (error) {
    return { error: "??? ?????." };
  }
}
