"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { isLocalEnvironment } from "@/lib/env";

export function GetStarted() {
  const [showAdminLink, setShowAdminLink] = useState(false);

  useEffect(() => {
    setShowAdminLink(isLocalEnvironment());
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Pintree</h1>
        <p className="mb-6">A powerful bookmark management platform to help you better organize and share web resources</p>
        {showAdminLink ? (
          <Link href="/admin/collections">
            <Button variant="default" size="lg">
              Get Started
            </Button>
          </Link>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              This is a bookmark navigation website. Browse the collections to discover useful resources.
            </p>
            <Button variant="default" size="lg" disabled>
              Browse Collections
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 