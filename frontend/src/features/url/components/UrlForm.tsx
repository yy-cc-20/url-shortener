import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { CreateUrlRequest } from '../../../../../libs/types/url';

export function UrlForm() {
  const emptyFormData: CreateUrlRequest = {
    long_url: '',
    custom_alias: undefined,
    expiry_time: undefined,
  };

  const [formData, setFormData] = useState<CreateUrlRequest>(emptyFormData);
  const [isAutoGenerate, setIsAutoGenerate] = useState(true);

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function isValidCustomAlias(alias: string | undefined): boolean {
    if (!alias) return true;

    const aliasRegex = /^[a-zA-Z0-9]{1,10}$/;
    return aliasRegex.test(alias);
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isValidUrl(formData.long_url)) {
      alert('Please enter a valid URL');
      return;
    }

    if (!isAutoGenerate && !isValidCustomAlias(formData.custom_alias)) {
      alert(
        'Custom alias can only contain letters and numbers, and must be between 1 and 10 characters',
      );
      return;
    }
    // Handle form submission logic here

    setFormData(emptyFormData);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>URL Shortener</CardTitle>
        <CardDescription>Enter the URL you want to shorten</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="url-input">URL*</FieldLabel>
                  <Input
                    id="url-input"
                    placeholder="https://example.com/very/long/url"
                    required
                    value={formData.long_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, long_url: e.target.value }))}
                  />
                </Field>
                <Field>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-generate-switch"
                      checked={isAutoGenerate}
                      onCheckedChange={setIsAutoGenerate}
                    />
                    <Label htmlFor="auto-generate-switch">Auto Generate Short URL</Label>
                  </div>
                  {!isAutoGenerate && (
                    <>
                      <FieldLabel htmlFor="custom-alias-input">Custom Alias</FieldLabel>
                      <Input
                        id="custom-alias-input"
                        placeholder="https://example.com/CustomAlias"
                        required
                        value={formData.custom_alias ?? ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, custom_alias: e.target.value }))
                        }
                      />
                    </>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="expiry-time-input">Expiry Time</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                      >
                        {formData.expiry_time ? (
                          format(new Date(formData.expiry_time), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.expiry_time}
                        onSelect={(date) => setFormData((prev) => ({ ...prev, expiry_time: date }))}
                        defaultMonth={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <Field orientation="horizontal">
              <Button type="submit">Submit</Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setFormData(emptyFormData);
                }}
              >
                Reset
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
