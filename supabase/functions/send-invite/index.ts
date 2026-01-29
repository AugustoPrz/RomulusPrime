import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InviteRequest {
  email: string;
  nombre: string;
  empleadoId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { email, nombre, empleadoId }: InviteRequest = await req.json();

    if (!email || !nombre || !empleadoId) {
      return new Response(
        JSON.stringify({ error: "Email, nombre y empleadoId son requeridos" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${req.headers.get("origin")}/setup-password`,
      data: {
        nombre: nombre,
        empleado_id: empleadoId,
      },
    });

    if (inviteError) {
      if (inviteError.message.includes("already been registered")) {
        return new Response(
          JSON.stringify({ error: "Este correo ya tiene una cuenta registrada" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      throw inviteError;
    }

    const { error: updateError } = await supabaseAdmin
      .from("empleados")
      .update({
        invite_status: "pending",
        invite_sent_at: new Date().toISOString(),
        auth_user_id: inviteData.user?.id,
      })
      .eq("id", empleadoId);

    if (updateError) {
      console.error("Error updating employee:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invitacion enviada correctamente",
        userId: inviteData.user?.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending invite:", error);
    return new Response(
      JSON.stringify({ error: "Error al enviar la invitacion" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
