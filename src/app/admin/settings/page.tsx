'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User, Shield, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const settingsSections = [
    {
      title: '個人設定',
      description: '管理您的個人資訊和帳號安全',
      icon: User,
      href: '/admin/settings/profile',
      color: 'text-blue-600',
    },
    {
      title: '系統配置',
      description: '管理系統參數和配置選項',
      icon: Settings,
      href: '#',
      color: 'text-gray-600',
      disabled: true,
    },
    {
      title: '安全設定',
      description: '系統安全和權限管理',
      icon: Shield,
      href: '#',
      color: 'text-green-600',
      disabled: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">設定</h1>
        <p className="text-muted-foreground">管理系統和個人設定</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section) => (
          <Card 
            key={section.title} 
            className={`relative overflow-hidden transition-all ${
              !section.disabled ? 'hover:shadow-lg cursor-pointer' : 'opacity-60'
            }`}
          >
            <Link 
              href={section.href} 
              className={section.disabled ? 'pointer-events-none' : ''}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-2 ${section.color} bg-opacity-10`}>
                    <section.icon className={`h-6 w-6 ${section.color}`} />
                  </div>
                  {!section.disabled && (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="mt-4">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {section.disabled && (
                  <p className="text-sm text-muted-foreground">即將推出</p>
                )}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}