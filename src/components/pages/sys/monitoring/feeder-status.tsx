"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { CheckCircle, Clock } from "lucide-react";

export default function FeederStatus() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Automatic Feeder Status</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Feed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">07:00 AM</TableCell>
                <TableCell>250g</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                </TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">12:00 PM</TableCell>
                <TableCell>200g</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                </TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">05:00 PM</TableCell>
                <TableCell>250g</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-blue-700 border-blue-300"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Scheduled
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  1h 23m
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
